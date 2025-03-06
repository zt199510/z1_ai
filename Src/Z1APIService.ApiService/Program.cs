using System.Text.Json.Serialization;
using System.Text.Json;
using Z1APIService.ApiService.Extensions;
using Z1APIService.ApiService.Infrastructure;
using System.Net;
using Z1APIService.ApiService.Converters;
using Z1.Core;
using Z1APIService.ApiService.Backstage;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddServices(builder.Configuration);

builder.Services.AddSingleton<FileStaticMiddleware>();

builder.Services.AddHttpClient();

builder.Services.AddHttpClient("Authorize")
    .ConfigureHttpClient(((_, client) =>
    {
        client.DefaultRequestHeaders.Add("Accept", "application/json");
        client.DefaultRequestHeaders.Add("User-Agent", "Z1Chat");
    }));

//ÅäÖÃ BingScraper µÄ HttpClient
builder.Services.AddConfigureBingScraperHttpClient();
builder.Services.ConfigureHttpJsonOptions((options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    options.SerializerOptions.Converters.Add(new JsonDateTimeConverter());
    options.SerializerOptions.Converters.Add(new JsonDateTimeOffsetConverter());
}));
builder.Services.AddHostedService<InitModelBackstageService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<FileStaticMiddleware>();
app.UseStaticFiles();
app.MapMiniApis();

var runMigration = builder.Configuration.GetValue<bool>("RunMigration");
if (runMigration)
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<IDbContext>();

    await dbContext.MigrateAsync();

}

await app.RunAsync();

