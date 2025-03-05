using Z1.Core;

namespace Z1APIService.ApiService;

public class DefaultUserContext : IUserContext
{
    public string UserId => "system";

    public T GetUser<T>()
    {
        return default;
    }

    public bool IsAuthenticated => false;

    public string Role => "system";
} 