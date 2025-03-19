using DocumentConverter;
using FastService;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using Storage.Core;
using System.ClientModel.Primitives;
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Z1.Core;
using Z1.Core.Entities;
using Z1.Core.Options;
using Z1APIService.ApiService.AI;
using Z1APIService.ApiService.Exceptions;
using Z1APIService.ApiService.Infrastructure;
using Z1APIService.ApiService.Options;
using Z1APIService.ApiService.Prompts;
using Z1APIService.ApiService.Services.Chat.Param;

namespace Z1APIService.ApiService.Services.Chat;

[Tags("Chat")]
public sealed class ChatService(
   IDbContext dbContext,
   IUserContext userContext,
   IStorageService storageService,
   IMapper mapper,
   BingScraper bingScraper,
   ImageService imageService,
   DocumentToMarkdown converter,
   IOptions<ChatSessionOptions> chatSessionOption,
   ILogger<ChatService> logger)
   : FastApi
{
    /// <summary>
    /// think: 协议头
    /// </summary>
    public const string ThinkStart = "<think>";

    /// <summary>
    /// think: 协议尾
    /// </summary>
    public const string ThinkEnd = "</think>";
    [Authorize]
    public async Task ChatCompleteAsync(HttpContext context, ChatCompleteParam input)
    {
        try
        {
            var session = await dbContext.Sessions.Where(x => x.Id == input.SessionId)
          .FirstOrDefaultAsync();
            List<Message> messages;
            if (session.HistoryMessagesCount <= 0)
            {
                messages = await dbContext.Messages.Where(x => x.SessionId == input.SessionId)
                    .OrderByDescending(x => x.CreatedAt)
                    .Include(x => x.Files)
                    .Include(x => x.Texts)
                    .ToListAsync();
            }
            else
            {
                messages = await dbContext.Messages
                    .Where(x => x.SessionId == input.SessionId)
                    .OrderByDescending(x => x.CreatedAt)
                    .Take(session.HistoryMessagesCount)
                    .Include(x => x.Files)
                    .Include(x => x.Texts)
                    .ToListAsync();
            }
            messages.Reverse();
            var first = true;
            var isThink = false;

            // 获取当前会话模型属于的模型
            var model = await dbContext.Models
                .AsNoTracking()
                .Where(x => x.ModelId == session.Model)
                .FirstOrDefaultAsync();
            var allModels = await dbContext.Models.ToListAsync();
            messages.Insert(0, new Message()
            {
                Role = "user",
                Texts = new List<MessageText>()
                {
                    new()
                    {
                        Text = """
                               <code_formatting_instructions>
                               提供代码或复杂内容时，请按照以下固定格式返回：

                               1. 代码格式：
                               ```[语言]|[文件名:文件描述]
                               代码内容
                               ```

                               2. 文案/复杂内容格式：
                               ```text|[文档名:内容描述]
                               文案或复杂内容
                               ```

                               示例格式：
                               ```python|[app.py:主应用文件]
                               def hello_world():
                                   return "Hello, World!"
                               ```

                               ```text|[marketing_copy.txt:产品描述文案]
                               这是一段详细的产品描述文案，内容较长时使用此格式...
                               ```

                               注意事项：
                               - 语言：明确指定编程语言（如python, javascript, java等）或内容类型（text, markdown等）
                               - 文件名和描述：提供有意义的文件名和简短描述
                               - 所有代码或复杂内容必须包含在代码块内，使用正确的语法高亮
                               - 当内容较长或结构复杂时，始终使用代码块格式保持清晰
                               - 在回复用户提问时保持友好可爱的风格，但在提供代码或技术内容时保持专业严谨
                               - 除非用户明确要求不需要解释，否则应提供适当的说明和与用户互动
                               </code_formatting_instructions>
                               """
                    }
                }
            });
            if (model.ModelId.EndsWith("DeepSeek-R1") || model.ModelId == "deepseek-reasoner")
            {
                messages.Insert(1, new Message()
                {
                    Role = "assistant",
                    Texts = new List<MessageText>()
                    {
                        new()
                        {
                            Text = "ok"
                        }
                    }
                });
            }


            var kernel = KernelFactory.CreateKernel("gpt-4o-mini", "http://abc.ztgametv.cn:10086/v1", "sk-uxaC405uujdT3CSS828dC75fF89b49B09dFa9a76B13667E3", "openai");
            var history = new ChatHistory();

            var requestToken = 0;
            var completeTokens = 0;

            if (input.Networking)
            {
                var last = messages.LastOrDefault(x => x.Role == "user");
                if (last != null)
                {
                    var result = await bingScraper.ScrapeAsync(last.Texts.Last().Text);

                    if (result.Results.Count > 0)
                    {
                        // 整理成prompt
                        var prompt = new StringBuilder();
                        foreach (var item in result.Results)
                        {
                            prompt.AppendLine(item.Title);
                            prompt.AppendLine(item.Url);
                            prompt.AppendLine(item.Snippet);
                        }

                        var value =
                            BingPrompt.Search.Replace("{{$searchResult}}", prompt.ToString());

                        requestToken += TokenHelper.GetTokens(value);

                        history.AddMessage(new AuthorRole("user"), value);


                        context.Response.Headers.ContentType = "text/event-stream";
                        context.Response.Headers.CacheControl = "no-cache";
                        context.Response.Headers.Connection = "keep-alive";

                        first = false;

                        // 发送搜索结果
                        await context.Response.WriteAsync("data: " + JsonSerializer.Serialize(new
                        {
                            data = result.Results,
                            type = "search",
                        }, JsonOptions.DefaultJsonSerializerOptions) + "\n\n");

                        // 更新message
                        await dbContext.MessageTexts.Where(x => x.Id == input.AssistantMessageId)
                            .ExecuteUpdateAsync(x =>
                                x.SetProperty(a => a.SearchResults,
                                    x => mapper.Map<List<SearchResult>>(result.Results)));
                    }
                }
            }

            foreach (var message in messages)
            {
                if (message.Role == "assistant" && message.Texts.Any(x => x.Text == "..."))
                    continue;
                if (message.Texts.Count != 0)
                {
                    var text = message.Texts.LastOrDefault();
                    requestToken += TokenHelper.GetTokens(text.Text);
                    history.AddMessage(new AuthorRole(message.Role), text.Text);
                }
            }

            //计算输入额度
            decimal quota = 0;
            if (model.Pricing is { Input: not null })
                quota = (decimal)(requestToken * model.Pricing.Input ?? 0);

            // 调用ChatComplete
            var chat = kernel.GetRequiredService<IChatCompletionService>();
            var sw = Stopwatch.StartNew();
            var sb = new StringBuilder();
            var reasoningUpdateSb = new StringBuilder();
            await foreach (var item in chat.GetStreamingChatMessageContentsAsync(history,
                   new OpenAIPromptExecutionSettings()
                   {
                       MaxTokens = session.MaxTokens,
                       Temperature = session.Temperature,
                       TopP = session.TopP,
                       FrequencyPenalty = session.FrequencyPenalty,
                   }, kernel))
            {
                if (first)
                {
                    // 设置sse
                    context.Response.Headers.ContentType = "text/event-stream";
                    context.Response.Headers.CacheControl = "no-cache";
                    context.Response.Headers.Connection = "keep-alive";

                    first = false;
                }

                if (item.InnerContent is StreamingFunctionCallUpdateContent functionCallUpdateContent)
                {
                    await context.Response.WriteAsync("data: " + JsonSerializer.Serialize(new
                    {
                        data = functionCallUpdateContent,
                        type = "function",
                    }, JsonOptions.DefaultJsonSerializerOptions) + "\n\n");
                }
                else
                {
                    var jsonContent = JsonNode.Parse(ModelReaderWriter.Write(item.InnerContent!));

                    // 判断jsonContent["choices"]索引是=0
                    if (jsonContent["choices"].AsArray().Count == 0)
                    {
                        continue;
                    }

                    // 如果存在reasoning_content则说明是推理
                    if (jsonContent!["choices"]![0]!["delta"]!["reasoning_content"] != null)
                    {
                        var reasoningUpdate = jsonContent!["choices"]![0]!["delta"]!["reasoning_content"];
                        reasoningUpdateSb.Append(reasoningUpdate);
                        await context.Response.WriteAsync("data: " + JsonSerializer.Serialize(new
                        {
                            data = reasoningUpdate,
                            type = "reasoning",
                        }, JsonOptions.DefaultJsonSerializerOptions) + "\n\n");
                    }
                    else
                    {
                        #region 解析内容中的think协议

                        if (first && item.ToString().Equals(ThinkStart, StringComparison.OrdinalIgnoreCase))
                        {
                            isThink = true;
                            continue;
                        }

                        if (item.ToString().Equals(ThinkEnd, StringComparison.OrdinalIgnoreCase))
                        {
                            isThink = false;
                            continue;
                        }

                        if (isThink)
                        {
                            reasoningUpdateSb.Append(item);
                            await context.Response.WriteAsync("data: " + JsonSerializer.Serialize(new
                            {
                                data = item,
                                type = "reasoning",
                            }, JsonOptions.DefaultJsonSerializerOptions) + "\n\n");
                            continue;
                        }

                        #endregion

                        sb.Append(item);
                        await context.Response.WriteAsync("data: " + JsonSerializer.Serialize(new
                        {
                            data = item.ToString(),
                            type = "chat",
                        }, JsonOptions.DefaultJsonSerializerOptions) + "\n\n");
                    }
                }
            }
            sw.Stop();
            completeTokens = TokenHelper.GetTokens(sb.ToString());
            completeTokens += TokenHelper.GetTokens(reasoningUpdateSb.ToString());
            var modelUsage = new MessageModelUsage()
            {
                MessageId = input.AssistantMessageId,
                SessionId = input.SessionId,
                CompleteTokens = completeTokens,
                PromptTokens = requestToken,
                ResponseTime = (int)sw.ElapsedMilliseconds
            };
            await context.Response.WriteAsync("data: " + JsonSerializer.Serialize(new
            {
                data = modelUsage,
                type = "model_usage",
            }, JsonOptions.DefaultJsonSerializerOptions) + "\n\n");
            await context.Response.WriteAsync("data: [done]" + "\n\n");
            await context.Response.CompleteAsync();

            await dbContext.MessageTexts.Where(x => x.Id == input.AssistantMessageId)
          .ExecuteUpdateAsync(x =>
              x.SetProperty(a => a.Text, x => sb.ToString())
                  .SetProperty(a => a.ReasoningUpdate, x => reasoningUpdateSb.ToString()));
            await dbContext.MessageModelUsages.Where(x => x.MessageId == input.AssistantMessageId).ExecuteDeleteAsync();
            await dbContext.MessageModelUsages.AddAsync(modelUsage);
            await dbContext.SaveChangesAsync();
            var userChatMessage = new ChatMessage
            {
                ChannelId = 1,
                SessionId = input.SessionId,
                Role = "user",
                Content = messages.Last(x => x.Role == "user").Texts.Last(x => !string.IsNullOrEmpty(x.Text)).Text,
                PromptTokens = requestToken,
                Files = messages.Last(x => x.Role == "user").Files.Select(x => x.FileId).ToList(),
                CompleteTokens = completeTokens,
                ResponseTime = (int)sw.ElapsedMilliseconds,
                ModelId = model.Id
            };

            // 创建记录
            var chatMessage = new ChatMessage
            {
                ChannelId = 1,
                SessionId = input.SessionId,
                Role = "assistant",
                Content = sb.ToString(),
                PromptTokens = requestToken,
                CompleteTokens = completeTokens,
                ResponseTime = (int)sw.ElapsedMilliseconds,
                ModelId = model.Id
            };
            // 计算完成额度
            if (model.Pricing is { Output: not null })
            {
                quota += (decimal)(completeTokens * model.Pricing.Output ?? 0);
            }
            quota = Math.Round(quota, 0, MidpointRounding.AwayFromZero);
            await dbContext.ChatMessages.AddAsync(chatMessage);
            await dbContext.ChatMessages.AddAsync(userChatMessage);
            await dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            await context.Response.WriteAsync("data: [done]" + "\n\n");
        }
    }


    /// <summary>
    /// 生成会话名称
    /// </summary>
    /// <param name="sessionId"></param>
    /// <returns></returns>
    [EndpointSummary("生成会话名称")]
    [Filter(typeof(ResultFilter))]
    [Authorize]
    public async Task<string> GenerateSessionNameAsync(long sessionId)
    {
        var session = await dbContext.Sessions
            .AsNoTracking()
            .Where(x => x.Id == sessionId)
            .FirstOrDefaultAsync();

        if (session == null)
        {
            throw new BusinessException("会话不存在");
        }

        if (string.IsNullOrEmpty(session.Model))
        {
            session.Model = chatSessionOption.Value.RenameModel;
        }

        // 获取当前会话模型属于的模型
        var model = await dbContext.Models
            .AsNoTracking()
            .Where(x => x.ModelId == session.Model)
            .FirstOrDefaultAsync();




        // 读取这个会话的最新的俩条消息
        var messages = (await dbContext.Messages
            .Where(x => x.SessionId == sessionId)
            .OrderByDescending(x => x.CreatedAt)
            .Take(2)
            .Include(x => x.Texts)
            .ToListAsync());

        if (messages.Count == 0)
        {
            throw new BusinessException("会话不存在消息");
        }

        messages.Reverse();

        var sb = new StringBuilder();

        foreach (var message in messages)
        {
            if (message.Texts.Count != 0)
            {
                var text = message.Texts.LastOrDefault();

                sb.AppendLine(message.Role + "：" + text.Text);
            }
        }
        var kernel = KernelFactory.CreateKernel(model.ModelId, "http://abc.ztgametv.cn:10086/v1", "sk-uxaC405uujdT3CSS828dC75fF89b49B09dFa9a76B13667E3", "openai");

        var chatPlugin = kernel.Plugins["Chat"];

        var result = await kernel.InvokeAsync(chatPlugin["TopicNaming"], new KernelArguments()
        {
            ["content"] = sb.ToString(),
        });

        await dbContext.Sessions.Where(x => x.Id == sessionId)
            .ExecuteUpdateAsync(x => x.SetProperty(a => a.Name, x => result.ToString()));

        return result.ToString();
    }

}
