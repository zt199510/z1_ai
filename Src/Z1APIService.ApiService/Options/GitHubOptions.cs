namespace Z1APIService.ApiService.Options;

public class GitHubOptions
{
    public const string Name = "GitHub";

    public bool Enabled { get; set; }

    /// <summary>
    /// GoogleClientId
    /// </summary>
    public string? ClientId { get; set; }

    /// <summary>
    /// GoogleClientSecret
    /// </summary>
    public string? ClientSecret { get; set; }
}
