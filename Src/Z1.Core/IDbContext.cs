﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;
using Z1.Core.Entities;

namespace Z1.Core;

public interface IDbContext
{
    DbSet<User> Users { get; set; }

    DbSet<UserOAuth> UserOAuths { get; set; }

    DbSet<Session> Sessions { get; set; }

    DbSet<SessionGroup> SessionGroups { get; set; }

    DbSet<MessageText> MessageTexts { get; set; }

    DbSet<MessageFile> MessageFiles { get; set; }

    DbSet<MessageModelUsage> MessageModelUsages { get; set; }

    DbSet<Message> Messages { get; set; }

    DbSet<FileStorage> FileStorages { get; set; }

    DbSet<Model> Models { get; set; }

    DbSet<ChatMessage> ChatMessages { get; set; }

    /// <summary>
    /// 模型渠道
    /// </summary>
    DbSet<ModelChannel> ModelChannels { get; set; }

    /// <summary>
    /// 模型渠道分享用户
    /// </summary>
    DbSet<ModelChannelShareUser> ModelChannelShareUsers { get; set; }

    /// <summary>
    /// 模型渠道邀请码
    /// </summary>
    DbSet<ModelChannelInviteCode> ModelChannelInviteCodes { get; set; }
    
    /// <summary>
    /// 提示词
    /// </summary>
    DbSet<UserPrompt> UserPrompts { get; set; }
    Task SaveChangesAsync();

    Task MigrateAsync();
}
