
using System.Text.Json.Serialization;
using System.Text.Json;

namespace Z1.Core.Options;

public class JsonOptions
{
    public static JsonSerializerOptions DefaultJsonSerializerOptions { get; } = new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
        PropertyNameCaseInsensitive = true,
        Converters =
        {
            new JsonStringEnumConverter()
        }
    };
}
