using System.Text.Json.Serialization;

namespace Z1APIService.ApiService.Services.Auth.Dto;

public class OAuthTokenDto
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }
}
