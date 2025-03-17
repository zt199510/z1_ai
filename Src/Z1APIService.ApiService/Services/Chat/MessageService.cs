﻿using FastService;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Z1.Core.Entities;
using Z1.Core;
using Z1APIService.ApiService.Exceptions;
using Z1APIService.ApiService.Infrastructure;
using Z1APIService.ApiService.Services.Chat.Dto;
using Microsoft.EntityFrameworkCore;
using Z1APIService.ApiService.Services.Chat.Param;
namespace Z1APIService.ApiService.Services.Chat;

[Tags("Chat")]
[Authorize]
[Filter(typeof(ResultFilter))]
public class MessageService(IDbContext dbContext, IUserContext userContext, IMapper mapper) : FastApi
{

    /// <summary>
    /// 获取所有消息
    /// </summary>
    [EndpointSummary("获取所有消息")]
    public async Task<List<MessageDto>> GetListAsync(long sessionId, int? lastId)
    {
        var query = dbContext.Messages.AsQueryable();

        if (lastId.HasValue)
        {
            query = query.Where(x => x.Id < lastId);
        }

        query = query
            .Where(x => x.CreatedBy == userContext.UserId && x.SessionId == sessionId)
            .Include(x => x.Texts)
            .Include(x => x.Files)
            .Include(x => x.ModelUsages)
            .OrderByDescending(x => x.Id)
            .Take(20);

        var result = await query.ToListAsync();

        var dto = mapper.Map<List<MessageDto>>(result);

        return dto.OrderBy(x => x.Id).ToList();
    }

    /// <summary>
    /// 根据Id获取消息
    /// </summary>
    /// <param name="id"></param>
    [EndpointSummary("根据Id获取消息")]
    public async Task<Message> GetAsync(long id)
    {
        var message = await dbContext.Messages
            .AsNoTracking()
            .Where(x => x.CreatedBy == userContext.UserId && x.Id == id)
            .FirstOrDefaultAsync();

        if (message == null)
        {
            throw new BusinessException("消息不存在");
        }

        return message;
    }

    /// <summary>
    /// 创建新消息
    /// </summary>
    /// <param name="message"></param>
    [EndpointSummary("创建新消息")]
    public async Task<MessageDto> CreateAsync(CreateMessage message)
    {
        var value = mapper.Map<Message>(message);

        value.CreatedBy = userContext.UserId;
        value.CreatedAt = DateTime.Now;

        var fileIds = value.Files.Select(x => x.FileId).ToList();

        var files = await dbContext.FileStorages
            .Where(x => fileIds.Contains(x.Id))
            .ToListAsync();

        value.Files = value.Files.Where(x => fileIds.Contains(x.FileId)).ToList();
        foreach (var file in value.Files)
        {
            var fileEntity = files.FirstOrDefault(x => x.Id == file.FileId);

            if (fileEntity != null)
            {
                file.FileName = fileEntity.FileName;
                file.FileSize = fileEntity.Size;
                file.FileUrl = fileEntity.ProviderId;
                file.FileId = fileEntity.Id;
                file.FileStorage = fileEntity;
            }
        }

        await dbContext.Messages.AddAsync(value);

        await dbContext.SaveChangesAsync();

        return mapper.Map<MessageDto>(value);
    }

    /// <summary>
    /// 删除消息
    /// </summary>
    /// <param name="id"></param>
    [EndpointSummary("删除消息")]
    public async Task DeleteAsync(long id)
    {

        await dbContext.MessageFiles.Where(x => x.CreatedBy == userContext.UserId && x.MessageId == id)
            .ExecuteDeleteAsync();

        await dbContext.MessageModelUsages.Where(x => x.CreatedBy == userContext.UserId && x.MessageId == id)
            .ExecuteDeleteAsync();

        await dbContext.MessageTexts.Where(x => x.CreatedBy == userContext.UserId && x.MessageId == id)
            .ExecuteDeleteAsync();

        await dbContext.Messages
            .Where(x => x.CreatedBy == userContext.UserId && x.Id == id)
            .ExecuteDeleteAsync();
    }

    /// <summary>
    /// 编辑消息
    /// </summary>
    /// <param name="id">消息ID</param>
    /// <param name="updateMessage">更新的消息内容</param>
    [EndpointSummary("编辑消息")]
    public async Task<MessageDto> UpdateAsync(long id, UpdateMessageParam updateMessage)
    {
        var message = await dbContext.Messages
            .Include(x => x.Texts)
            .Include(x => x.Files)
            .Where(x => x.CreatedBy == userContext.UserId && x.Id == id)
            .FirstOrDefaultAsync();

        if (message == null)
        {
            throw new BusinessException("消息不存在");
        }

        // 更新消息内容
        mapper.Map(updateMessage, message);

        // 更新文本内容
        message.Texts.Clear();
        message.Texts = mapper.Map<List<MessageText>>(updateMessage.Texts);

        await dbContext.SaveChangesAsync();

        return mapper.Map<MessageDto>(message);
    }
}
