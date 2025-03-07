﻿namespace Z1APIService.ApiService.Services.Chat.Param;

public class ChatCompleteParam
{
    /// <summary>
    /// 会话Id
    /// </summary>
    public long SessionId { get; set; }

    /// <summary>
    /// 上级消息Id
    /// </summary>
    public long? ParentId { get; set; }

    /// <summary>
    /// 助手消息id
    /// </summary>
    public long AssistantMessageId { get; set; }

    /// <summary>
    /// 消息
    /// </summary>
    public string Text { get; set; }

    /// <summary>
    /// 启用function call
    /// </summary>
    public List<string> FunctionCalls { get; set; } = new();

    /// <summary>
    /// 是否启用联网模式
    /// </summary>
    public bool Networking { get; set; }
}
