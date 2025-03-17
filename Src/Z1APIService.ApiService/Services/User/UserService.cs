using FastService;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Z1.Core;
using Z1.Core.Dto;
using Z1APIService.ApiService.Dto;
using Z1APIService.ApiService.Exceptions;
using Z1APIService.ApiService.Infrastructure;
using Z1APIService.ApiService.Services.User.Dto;

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
            throw new BusinessException("用户不存在");

        return mapper.Map<UserDto>(user);
    }



    /// <summary>
    /// 获取当前用户信息
    /// </summary>
    [Authorize]
    public async Task<UserDto> GetCurrentUserAsync()
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == userContext.UserId);

        if (user == null)
            throw new BusinessException("用户不存在");

        user.PasswordHash = null;

        return mapper.Map<UserDto>(user);
    }

    [Authorize(Roles = "Admin")]
    public async Task<PageDto<UserDto>> GetListAsync(string search, int page, int size)
    {
        var query = dbContext.Users.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(x => x.UserName.Contains(search) || x.DisplayName.Contains(search));
        }

        var total = await query.CountAsync();

        var users = await query
            .OrderBy(x => x.UserName)
            .Skip((page - 1) * size)
            .Take(size)
            .ToListAsync();

        users.ForEach(x => x.PasswordHash = null);

        return new PageDto<UserDto>(total, mapper.Map<List<UserDto>>(users));
    }

    [Authorize(Roles = "Admin")]
    public async Task<UserDto> UpdateAsync(UpdateUserDto updateUserDto)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == updateUserDto.Id);
        if (user == null)
        {
            throw new BusinessException("User does not exist");
        }

        // 校验账号和密码是否为空
        if (string.IsNullOrEmpty(updateUserDto.UserName) || string.IsNullOrEmpty(updateUserDto.PasswordHash))
        {
            throw new BusinessException("用户名和密码不能为空");
        }

        // 校验角色是否为空
        if (string.IsNullOrEmpty(updateUserDto.Role))
        {
            throw new BusinessException("角色不能为空");
        }

        // 校验角色是否合法
        if (updateUserDto.Role != "Admin" && updateUserDto.Role != "User")
        {
            throw new BusinessException("角色不合法");
        }

        // 校验邮箱格式
        if (!string.IsNullOrEmpty(updateUserDto.Email) &&
            !Regex.IsMatch(updateUserDto.Email, @"^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$"))
        {
            throw new BusinessException("邮箱格式不正确");
        }

        // 校验手机号格式
        if (!string.IsNullOrEmpty(updateUserDto.Phone) && !Regex.IsMatch(updateUserDto.Phone, @"^1[3456789]\d{9}$"))
        {
            throw new BusinessException("手机号格式不正确");
        }

        // 校验密码长度和复杂度至少六位,包含字母和数字
        if (updateUserDto.PasswordHash.Length < 6 ||
            !Regex.IsMatch(updateUserDto.PasswordHash, @"^(?=.*[0-9])(?=.*[a-zA-Z]).*$"))
        {
            throw new BusinessException("密码长度至少6位，且必须包含字母和数字");
        }

        // 校验用户名是否重复
        if (await dbContext.Users.AnyAsync(x => x.UserName == updateUserDto.UserName && x.Id != updateUserDto.Id))
        {
            throw new BusinessException("用户名已存在");
        }

        // 如果头像为空，设置默认头像
        if (string.IsNullOrEmpty(updateUserDto.Avatar))
        {
            updateUserDto.Avatar = "/logo.png";
        }

        mapper.Map(updateUserDto, user);
        dbContext.Users.Update(user);
        await dbContext.SaveChangesAsync();
        return mapper.Map<UserDto>(user);
    }

}
