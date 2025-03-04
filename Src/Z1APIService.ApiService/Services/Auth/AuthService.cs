using FastService;
using Lazy.Captcha.Core;
using Microsoft.Extensions.Options;
using Z1.Core;
using Z1APIService.ApiService.Infrastructure;
using Z1APIService.ApiService.Options;
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
    IHttpClientFactory httpClientFactory) :FastApi
{


}
