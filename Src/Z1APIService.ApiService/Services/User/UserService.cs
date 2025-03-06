using FastService;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Z1.Core;
using Z1APIService.ApiService.Dto;
using Z1APIService.ApiService.Exceptions;
using Z1APIService.ApiService.Infrastructure;

namespace Z1APIService.ApiService.Services.User;

[Filter(typeof(ResultFilter))]
public class UserService(IDbContext dbContext, IMapper mapper, IUserContext userContext) : FastApi
{

    /// <summary>
    /// 通过账号获取用户信息
    /// </summary>
    /// <param name="account"></param>
    [IgnoreRoute]
    public async Task<UserDto> GetAsync(string account)
    {
        // 支持手机号邮箱，用户名
        var user = await dbContext.Users.FirstOrDefaultAsync(
            x => x.Phone == account || x.Email == account || x.UserName == account);

        if (user == null)
        {
            throw new BusinessException("用户不存在");
        }

        return mapper.Map<UserDto>(user);
    }
}
