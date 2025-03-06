using FastService;
using Lazy.Captcha.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text.RegularExpressions;
using UglyToad.PdfPig.Tokens;
using Z1.Core;
using Z1APIService.ApiService.Exceptions;
using Z1APIService.ApiService.Infrastructure;
using Z1APIService.ApiService.Options;
using Z1APIService.ApiService.Services.Auth.Param;
using Z1APIService.ApiService.Services.User;

namespace Z1APIService.ApiService.Services.Auth;


[Filter(typeof(ResultFilter))]
[Tags("Auth")]
public class AuthService(ICaptcha captcha,
    UserService userService,
    JwtHelper jwtHelper,
    IDbContext dbContext,
    ILogger<AuthService> logger,
    IOptions<GoogelOption> googenOptions,
    IHttpClientFactory httpClientFactory) : FastApi
{

    [EndpointSummary("登录")]
    public async Task<string> Login(AuthParam Param)
    {
        // 校验验证码
        //if (!captcha.Validate(Param.CodeId, Param.Code))
        //{
        //    throw new BusinessException("验证码错误");
        //}

        var user = await userService.GetAsync(Param.UserName);
        // 校验密码
        if (user.PasswordHash != EncryptionHelper.Md5(Param.Password))
            throw new BusinessException("密码错误");

        user.PasswordHash = string.Empty;
        user.Phone = string.Empty;

        var dist = new Dictionary<string, string>
        {
            { "User", JsonSerializer.Serialize(user) }
        };

        var token = jwtHelper.CreateToken(dist, user.Id, [user.Role]);
        return await Task.FromResult(token);
    }


    /// <summary>
    /// 注册账号
    /// </summary>
    [EndpointSummary("注册账号")]
    public async Task<string> Register(RegisterParam Param)
    {
        // 校验邮箱格式
        if (!string.IsNullOrEmpty(Param.Email) &&
            !Regex.IsMatch(Param.Email, @"^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$"))
            throw new BusinessException("邮箱格式不正确");

        // 校验手机号格式
        if (!string.IsNullOrEmpty(Param.Phone) && !Regex.IsMatch(Param.Phone, @"^1[3456789]\d{9}$"))
            throw new BusinessException("手机号格式不正确");

        // 校验密码长度和复杂度至少六位
        if (string.IsNullOrEmpty(Param.PasswordHash) || Param.PasswordHash.Length < 6 ||
            !Regex.IsMatch(Param.PasswordHash, @"^(?=.*[0-9])(?=.*[a-zA-Z]).*$"))
            throw new BusinessException("密码长度至少6位，且必须包含字母和数字");

        // 校验用户名是否重复
        if (await dbContext.Users.AnyAsync(x => x.UserName == Param.UserName))
            throw new BusinessException("用户名已存在");

        // 校验验证码
        if (!captcha.Validate(Param.CodeId, Param.Code))
            throw new BusinessException("验证码错误");
        var user = await dbContext.Users.FirstOrDefaultAsync(x => x.UserName == Param.UserName);

        if (user != null)
            throw new BusinessException("用户名已存在");

        // 校验邮箱
        if (await dbContext.Users.AnyAsync(x => x.Email == Param.Email))
            throw new BusinessException("邮箱已存在");
                var userEntity = new Z1.Core.Entities.User()
                {
                    UserName = Param.UserName,
                    DisplayName = Param.DisplayName,
                    PasswordHash = EncryptionHelper.Md5(Param.PasswordHash),
                    Email = Param.Email,
                    Phone = Param.Phone,
                    Role = "User",
                    Enabled = true,
                    Avatar = "/images/avatar.jpg",
                    CreatedAt = DateTime.Now,
                };

        user = (await dbContext.Users.AddAsync(userEntity)).Entity;
        await dbContext.SaveChangesAsync();

        user.PasswordHash = string.Empty;
        user.Phone = string.Empty;
        var dist = new Dictionary<string, string>
        {
            { "User", JsonSerializer.Serialize(user) }
        };

        // 生成token
        var token = jwtHelper.CreateToken(dist, user.Id, [user.Role]);

        return await Task.FromResult(token);
    }
}
