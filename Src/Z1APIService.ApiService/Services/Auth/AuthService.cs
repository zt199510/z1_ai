using FastService;
using Lazy.Captcha.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OpenAI.Models;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;
using UglyToad.PdfPig.Tokens;
using Z1.Core;
using Z1.Core.Entities;
using Z1APIService.ApiService.Exceptions;
using Z1APIService.ApiService.Infrastructure;
using Z1APIService.ApiService.Options;
using Z1APIService.ApiService.Services.Auth.Dto;
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
    IOptions<GitHubOptions> gitHubOptions,
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


    public async Task<List<AuthOauthDto>> GetOAuths()
    {
        var result = new List<AuthOauthDto>();

        if (googenOptions.Value.Enabled)
        {
            logger.LogInformation("Google OAuth is enabled");
            result.Add(new AuthOauthDto()
            {
                Provider = "Google",
                Icon = "Google",
                ClientId = googenOptions.Value.ClientId
            });
        }

        if (gitHubOptions.Value.Enabled)
        {
            logger.LogInformation("GitHub OAuth is enabled");
            result.Add(new AuthOauthDto()
            {
                Provider = "GitHub",
                Icon = "GitHub",
                ClientId = gitHubOptions.Value.ClientId
            });
        }

        //if (thorOptions.Value.Enabled)
        //{
        //    logger.LogInformation("Thor OAuth is enabled");
        //    result.Add(new AuthOauthDto()
        //    {
        //        Provider = "Thor",
        //        Icon = "Thor",
        //        ClientId = thorOptions.Value.Host ?? "https://api.token-ai.cn"
        //    });
        //}

        return await Task.FromResult(result);
    }

    public async Task<string> Callback(string provider, string code, string redirectUri)
    {
        var client = httpClientFactory.CreateClient("Authorize");

        OAuthUserDto<object> userDto = null;

        // 这里需要处理第三方登录的逻辑
        if (provider.Equals("github", StringComparison.OrdinalIgnoreCase))
        {
            // 处理github登录
            var clientId = gitHubOptions.Value.ClientId;
            var clientSecret = gitHubOptions.Value.ClientSecret;

            var response =
                await client.PostAsync(
                    $"https://github.com/login/oauth/access_token?code={code}&client_id={clientId}&client_secret={clientSecret}",
                    null);

            var result = await response.Content.ReadFromJsonAsync<OAuthTokenDto>();
            if (result is null)
            {
                throw new Exception("Github授权失败");
            }

            var request = new HttpRequestMessage(HttpMethod.Get,
                $"https://api.github.com/user")
            {
                Headers =
                {
                    Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken)
                }
            };

            var responseMessage = await client.SendAsync(request);

            userDto = await responseMessage.Content.ReadFromJsonAsync<OAuthUserDto<object>>();
        }
        else if (provider.Equals("gitee", StringComparison.OrdinalIgnoreCase))
        {
            // 处理github登录
            // var clientId = configuration["OAuth:Gitee:ClientId"];
            // var clientSecret = configuration["OAuth:Gitee:ClientSecret"];
            //
            // var response =
            //     await client.PostAsync(
            //         $"https://gitee.com/oauth/token?grant_type=authorization_code&redirect_uri={redirectUri}&response_type=code&code={code}&client_id={clientId}&client_secret={clientSecret}",
            //         null);
            //
            // var result = await response.Content.ReadFromJsonAsync<OAuthTokenDto>();
            // if (result?.AccessToken is null)
            // {
            //     throw new Exception("Gitee授权失败");
            // }
            //
            //
            // var request = new HttpRequestMessage(HttpMethod.Get,
            //     $"https://gitee.com/api/v5/user?access_token=" + result.AccessToken);
            //
            // var responseMessage = await client.SendAsync(request);
            //
            // userDto = await responseMessage.Content.ReadFromJsonAsync<OAuthUserDto>();
        }
    
        // 获取是否存在当前渠道
        var oauth = await dbContext.UserOAuths.FirstOrDefaultAsync(x =>
            x.Provider == provider && x.ProviderUserId == userDto.Id.ToString());

       Z1.Core.Entities.User user;

        if (oauth == null)
        {
            // 如果邮箱是空则随机生成
            if (string.IsNullOrEmpty(userDto.Email))
            {
                userDto.Email = "oauth_" + Guid.NewGuid().ToString("N") + "@token-ai.cn";
            }


            // 创建一个新的用户
            user = new Z1.Core.Entities.User()
            {
                Id = Guid.NewGuid().ToString("N"),
                Avatar = userDto.AvatarUrl ?? "/logo.png",
                UserName = userDto.Email,
                Email = userDto.Email,
                PasswordHash = string.Empty,
                DisplayName = userDto.Name,
                Enabled = true,
                Phone = string.Empty,
                Role = "User",
            };

            oauth = new UserOAuth()
            {
                Provider = provider,
                UserId = user.Id,
                ProviderUserId = userDto.Id.ToString(),
            };

        

            await dbContext.UserOAuths.AddAsync(oauth);

            user = (await dbContext.Users.AddAsync(user)).Entity;

            await dbContext.UserPrompts.AddRangeAsync(UserPrompt.CreateDefault(user.Id));

            await dbContext.SaveChangesAsync();
        }
        else
        {
            user = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == oauth.UserId);
        }

        user.PasswordHash = string.Empty;

        var dist = new Dictionary<string, string>
        {
            { "User", JsonSerializer.Serialize(user) }
        };

        var token = jwtHelper.CreateToken(dist, user.Id, [user.Role]);

        return await Task.FromResult(token);
    }

}
