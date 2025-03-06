using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Z1.Core.Entities;

/// <summary>
/// 文件存储
/// </summary>
public sealed class FileStorage : Entity<string>
{
    /// <summary>
    /// 文件名
    /// </summary>
    public string FileName { get; set; } = null!;

    /// <summary>
    /// 文件类型
    /// </summary>
    public string ContentType { get; set; } = null!;

    /// <summary>
    /// 文件大小
    /// </summary>
    public int Size { get; set; }

    /// <summary>
    /// 文件绑定Id
    /// </summary>
    public string? ProviderId { get; set; }
}
