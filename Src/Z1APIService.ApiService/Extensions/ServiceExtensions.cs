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
        // 确保IUserContext已注册
        services.AddScoped<IUserContext, DefaultUserContext>();

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

    public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddJwt(configuration);

        services.AddDbContext(configuration);

        //services.AddStorage(configuration);

        services.AddSingleton<BingScraper>();

        //services.AddScoped<ImageService>();

        services.AddSingleton<DocumentToMarkdown>((provider =>
        {
            var env = provider.GetRequiredService<IWebHostEnvironment>();
            var chatOptions = provider.GetRequiredService<IOptions<ChatOptions>>().Value;

            return new DocumentToMarkdown(chatOptions, Path.Combine(env.WebRootPath, "images"));
        }));

        return services;
    }


    public static WebApplication MapMiniApis(this WebApplication app)
    {
        app.MapFast();

        return app;
    }
}
