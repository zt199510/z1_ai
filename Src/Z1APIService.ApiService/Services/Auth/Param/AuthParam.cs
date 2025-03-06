namespace Z1APIService.ApiService.Services.Auth.Param;

public class AuthParam
{
    public string UserName { get; set; }
    public string Password { get; set; }
    /// <summary>
    /// 验证码
    /// </summary>
    public string? Code { get; set; }
    /// <summary>
    /// 验证码ID
    /// </summary>
    public string? CodeId { get; set; }
    /// <summary>
    /// 是否记住
    /// </summary>
    public bool Remember { get; set; }

}
