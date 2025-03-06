using FastService;
using Lazy.Captcha.Core;
using Z1APIService.ApiService.Infrastructure;
using Z1APIService.ApiService.Services.Verification.Dto;

namespace Z1APIService.ApiService.Services.Verification;

/// <summary>
/// 验证码服务
/// </summary>
/// <param name="captcha"></param>
[Filter(typeof(ResultFilter))]
[Tags("Verification")]
public class VerificationService(ICaptcha captcha) : FastApi
{
    [EndpointSummary("获取验证码")]
    public Task<VerificationDto> GetAsync(string type)
    {
        var uuid = type + ":" + Guid.NewGuid().ToString("N");
        var code = captcha.Generate(uuid, 240);


        return Task.FromResult(new VerificationDto
        {
            Id = uuid,
            Code = "data:image/png;base64," + code.Base64
        });
    }
}
