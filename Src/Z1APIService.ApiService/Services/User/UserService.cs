using FastService;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc.Filters;
using Z1.Core;
using Z1APIService.ApiService.Infrastructure;

namespace Z1APIService.ApiService.Services.User;

[Filter(typeof(ResultFilter))]
public class UserService(IDbContext dbContext, IMapper mapper, IUserContext userContext) : FastApi
{


}
