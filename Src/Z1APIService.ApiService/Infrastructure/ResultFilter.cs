﻿using Z1APIService.ApiService.Dto;

namespace Z1APIService.ApiService.Infrastructure;

/// <summary>
/// 服务包装器
/// </summary>
/// <param name="logger"></param>
public sealed class ResultFilter(ILogger<ResultFilter> logger) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        try
        {
            var value = await next(context);

            return ResultDto.SuccessResult(value);
        }
        catch (Exception e)
        {
            logger.LogError("服务发送异常：" + e);
            return ResultDto.FailResult(e.Message);
        }
    }
}
