﻿using Z1APIService.ApiService.Dto;

namespace Z1APIService.ApiService.Services.Chat.Dto;

public class ChatMessageDto : EntityDto<long>
{
    /// <summary>
    /// 会话Id
    /// 空=临时会话？
    /// </summary>
    public long? SessionId { get; set; }

    /// <summary>
    /// 创建角色
    /// </summary>
    public string Role { get; set; } = null!;

    /// <summary>
    /// 对话记录内容
    /// </summary>
    public string Content { get; set; } = null!;

    /// <summary>
    /// 对话文件id
    /// </summary>
    public List<string> Files { get; set; } = new();

    /// <summary>
    /// 请求token
    /// </summary>
    public int PromptTokens { get; set; }

    /// <summary>
    /// 完成token
    /// </summary>
    /// <returns></returns>
    public int CompleteTokens { get; set; }

    /// <summary>
    /// 响应耗时 (ms)
    /// </summary>
    /// <returns></returns>
    public int ResponseTime { get; set; }

    /// <summary>
    /// 分享渠道id
    /// </summary>
    public long? ShareId { get; set; }

    /// <summary>
    /// 渠道id
    /// </summary>
    public long? ChannelId { get; set; }

    /// <summary>
    /// 使用模型id
    /// </summary>
    public string? ModelId { get; set; }

}
