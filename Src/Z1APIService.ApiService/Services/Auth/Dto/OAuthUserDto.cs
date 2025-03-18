﻿using System.Text.Json.Serialization;

namespace Z1APIService.ApiService.Services.Auth.Dto;

public class OAuthUserDto<T>
{
    [JsonPropertyName("id")] public T Id { get; set; }

    [JsonPropertyName("avatar_url")] public string AvatarUrl { get; set; }

    [JsonPropertyName("name")] public string Name { get; set; }

    [JsonPropertyName("email")] public string Email { get; set; }
}