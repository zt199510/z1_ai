using System.Net;
using System.Text;
using DocumentConverter;
using EntityFramework.Sqlite.Extensions;
using Mapster;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Z1.Core;
using Z1APIService.ApiService;
using Z1APIService.ApiService.Infrastructure;
using Z1APIService.ApiService.Options;
using Storage.LiteDB.Extensions;
using Z1APIService.ApiService.Services;
namespace Z1APIService.ApiService.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddJwt(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();

        services.AddScoped<IUserContext, UserContext>();

        var option = configuration.GetSection(JwtOptions.Name);

        var jwtOption = option.Get<JwtOptions>();

        services.Configure<JwtOptions>(option);

        services.Configure<ChatSessionOptions>(configuration.GetSection(ChatSessionOptions.Name));

        services.Configure<ChatOptions>(configuration.GetSection(ChatOptions.Name));

        services.Configure<GoogelOption>(configuration.GetSection(GoogelOption.Name));

        services.AddAuthorization()
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOption!.Issuer,
                    ValidAudience = jwtOption.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOption.Secret))
                };
            });

        services.WithFast();

        services.AddMapster();

        services.AddSingleton<JwtHelper>();

        services.AddCaptcha();

        return services;
    }

    public static IServiceCollection AddDbContext(this IServiceCollection services, IConfiguration configuration)
    {

        var type = configuration.GetConnectionString("Type")?.Trim();

        if (string.IsNullOrEmpty(type))
        {
            throw new ArgumentNullException("Type");
        }

        if (type.Equals("sqlite", StringComparison.OrdinalIgnoreCase))
        {
            services.AddSqliteDbContext(configuration);
        }
        else if (type.Equals("postgresql", StringComparison.OrdinalIgnoreCase))
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
            AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);
            //services.AddPostgreSQLDbContext(configuration);
        }
        else if (type.Equals("sqlserver", StringComparison.OrdinalIgnoreCase))
        {
            // services.AddSqlServerDbContext(configuration);
        }
        else if (type.Equals("mysql", StringComparison.OrdinalIgnoreCase))
        {
            // services.AddMySqlDbContext(configuration);
        }
        else if (type.Equals("dm", StringComparison.OrdinalIgnoreCase))
        {
            //  services.AddDaMengDbContext(configuration);
        }

        return services;
    }
    public static IServiceCollection AddStorage(this IServiceCollection services, IConfiguration configuration)
    {
        if (configuration["Storage:Type"].Equals("LiteDB", StringComparison.OrdinalIgnoreCase))
        {
            services.AddLiteDb();
        }

        return services;
    }
    public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddJwt(configuration);

        services.AddDbContext(configuration);

        services.AddStorage(configuration);

        services.AddSingleton<BingScraper>();

        services.AddScoped<ImageService>();

        services.AddSingleton<DocumentToMarkdown>((provider =>
        {
            var env = provider.GetRequiredService<IWebHostEnvironment>();
            var chatOptions = provider.GetRequiredService<IOptions<ChatOptions>>().Value;

            return new DocumentToMarkdown(chatOptions, Path.Combine(env.WebRootPath, "images"));
        }));

        return services;
    }

    /// <summary>
    /// 配置 BingScraper 的 HttpClient
    /// </summary>
    /// <param name="services">服务集合</param>
    /// <returns>服务集合</returns>
    public static IServiceCollection AddConfigureBingScraperHttpClient(this IServiceCollection services)
    {
        services.AddHttpClient(nameof(BingScraper))
            .ConfigureHttpClient(((provider, client) =>
            {
                // 模仿浏览器请求，设置 User-Agent
                client.DefaultRequestHeaders.Add("User-Agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0");
                client.DefaultRequestHeaders.Add("x-client-data",
                    "eyIxIjoiMSIsIjIiOiIxIiwiMyI6IjAiLCI0IjoiMjgwNDcxNzQzOTQ1Mzc1MjUwMCIsIjYiOiJzdGFibGUiLCI5IjoiZGVza3RvcCJ9");
                client.DefaultRequestHeaders.Add("Accept",
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
                client.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
                client.DefaultRequestHeaders.Add("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8");
                client.DefaultRequestHeaders.Add("Cache-Control", "max-age=0");
                client.DefaultRequestHeaders.Add("Connection", "keep-alive");
                client.DefaultRequestHeaders.Add("Host", "www.bing.com");
                client.DefaultRequestHeaders.Add("Upgrade-Insecure-Requests", "1");
                client.DefaultRequestHeaders.Add("Referer", "https://www.bing.com/");
                client.DefaultRequestHeaders.Add("Sec-Fetch-Dest", "document");
                client.DefaultRequestHeaders.Add("Sec-Fetch-Mode", "navigate");
                client.DefaultRequestHeaders.Add("Sec-Fetch-Site", "none");
                client.DefaultRequestHeaders.Add("Sec-Fetch-User", "?1");
                client.DefaultRequestHeaders.Add("Sec-GPC", "1");
                client.DefaultRequestHeaders.Add("TE", "trailers");
                client.DefaultRequestHeaders.Add("sec-ch-ua",
                    "\"Not(A:Brand\";v=\"99\", \"Microsoft Edge\";v=\"133\", \"Chromium\";v=\"133\"");
                client.DefaultRequestHeaders.Add("sec-ch-ua-arch", "\"x86\"");
                client.DefaultRequestHeaders.Add("sec-ch-ua-bitness", "\"64\"");
                client.DefaultRequestHeaders.Add("sec-ch-ua-full-version", "\"133.0.3065.82\"");
                client.DefaultRequestHeaders.Add("sec-ch-ua-mobile", "?0");
                client.DefaultRequestHeaders.Add("sec-ch-ua-model", "\"\"");
                client.DefaultRequestHeaders.Add("sec-ch-ua-platform", "\"Windows\"");
                client.DefaultRequestHeaders.Add("sec-ch-ua-platform-version", "\"14.0.0\"");
                client.DefaultRequestHeaders.Add("sec-fetch-dest", "document");
                client.DefaultRequestHeaders.Add("sec-fetch-mode", "navigate");
                client.DefaultRequestHeaders.Add("sec-fetch-site", "cross-site");
                // 默认启用h2
                client.DefaultRequestVersion = HttpVersion.Version20;
                client.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrHigher;
            }));

        return services;
    }

    public static WebApplication MapMiniApis(this WebApplication app)
    {
        app.MapFast();

        return app;
    }
}
