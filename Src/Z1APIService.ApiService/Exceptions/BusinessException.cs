﻿namespace Z1APIService.ApiService.Exceptions;

/// <summary>
/// 业务异常
/// </summary>
/// <param name="message"></param>
public class BusinessException(string message) : Exception(message);
