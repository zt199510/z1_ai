using FastService;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Z1.Core;
using Z1.Core.Dto;
using Z1APIService.ApiService.Infrastructure;
using Z1APIService.ApiService.Services.Chat.Dto;

namespace Z1APIService.ApiService.Services.Chat;

[Tags("Chat")]
[Filter(typeof(ResultFilter))]
public sealed class ChatMessageService(
    IDbContext context,
    IMapper mapper,
    IUserContext userContext) : FastApi
{

    [Authorize(Roles = "Admin")]
    public async Task<PageDto<ChatMessageDto>> GetListAsync(string? search, int page, int pageSize)
    {
        var query = context.ChatMessages
            .Where(x => x.CreatedBy == userContext.UserId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x => x.Content.Contains(search));
        }

        var result = await query
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var total = await query.CountAsync();

        return new PageDto<ChatMessageDto>(total, mapper.Map<List<ChatMessageDto>>(result));
    }

}
