namespace Z1APIService.ApiService.Services.Auth.Dto;

public class AuthOauthDto
{
    public string Provider { get; set; }

    /// <summary>
    /// 显示图标
    /// </summary>
    public string Icon { get; set; }

    public string ClientId { get; set; }
}
