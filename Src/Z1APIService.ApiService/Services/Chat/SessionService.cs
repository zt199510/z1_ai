using FastService;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Z1.Core;
using Z1.Core.Entities;
using Z1APIService.ApiService.Exceptions;
using Z1APIService.ApiService.Infrastructure;
using Z1APIService.ApiService.Options;
using Z1APIService.ApiService.Services.Chat.Dto;
using Z1APIService.ApiService.Services.Chat.Param;

namespace Z1APIService.ApiService.Services.Chat;

[Tags("Chat")]
[Authorize]
[Filter(typeof(ResultFilter))]
public class SessionService(
    IDbContext dbContext,
    IMapper mapper,
    IUserContext userContext,
    IOptions<ChatSessionOptions> sessionOptions) : FastApi
{

    /// <summary>
    /// 获取所有会话
    /// </summary>
    [EndpointSummary("获取所有会话")]
    public async Task<IEnumerable<SessionDto>> GetListAsync(string? search)
    {
        var sessions = await dbContext.Sessions
            .Where(x => x.CreatedBy == userContext.UserId && (string.IsNullOrEmpty(search) || x.Name.Contains(search)))
            .OrderByDescending(x => x.Favorite)
            .ThenBy(x => x.CreatedAt)
            .ToListAsync();

        var dto = mapper.Map<IEnumerable<SessionDto>>(sessions);

        return dto;
    }


    /// <summary>
    /// 取消或者收藏会话
    /// </summary>
    /// <returns></returns>
    [EndpointSummary("取消或者收藏会话")]
    public async Task ToggleFavoriteAsync(long sessionId)
    {
        await dbContext.Sessions
            .Where(x => x.Id == sessionId && x.CreatedBy == userContext.UserId)
            .ExecuteUpdateAsync(x => x.SetProperty(a => a.Favorite, a => !a.Favorite));
    }

    /// <summary>
    /// 根据Id获取会话
    /// </summary>
    [EndpointSummary("根据Id获取会话")]
    public async Task<Session> GetAsync(long id)
    {
        var session = await dbContext.Sessions
            .AsNoTracking()
            .Include(s => s.SessionGroup)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null)
        {
            throw new BusinessException("会话不存在");
        }

        return session;
    }

    /// <summary>
    /// 创建新会话
    /// </summary>
    [EndpointSummary("创建新会话")]
    public async Task<Session> CreateAsync(CreateSessionParam sessionInput)
    {
        sessionInput.Avatar = "🧸";
        var session = mapper.Map<Session>(sessionInput);

        session.CreatedBy = userContext.UserId;
        session.CreatedAt = DateTime.Now;
        session.Model = sessionInput.ModelId;

        var model = await dbContext.Models
            .AsNoTracking()
            .Where(x => x.ModelId == sessionOptions.Value.RenameModel)
            .FirstOrDefaultAsync();

        session.RenameModel = model.Id;

        await dbContext.Sessions.AddAsync(session);
        await dbContext.SaveChangesAsync();

        return session;
    }


    /// <summary>
    /// 删除会话
    /// </summary>
    [EndpointSummary("删除会话")]
    public async Task DeleteAsync(long id)
    {
        await dbContext.Sessions
            .Where(s => s.Id == id && s.CreatedBy == userContext.UserId)
            .ExecuteDeleteAsync();

        // 删除会话的同时删除会话的所有消息
        await dbContext.Messages
            .Where(m => m.SessionId == id)
            .ExecuteDeleteAsync();
    }
}
