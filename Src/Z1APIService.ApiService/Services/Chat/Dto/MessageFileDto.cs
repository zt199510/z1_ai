using Z1APIService.ApiService.Dto;

namespace Z1APIService.ApiService.Services.Chat.Dto;

public class MessageFileDto : EntityDto<long>
{
    public long MessageId { get; set; }

    public string FileId { get; set; }

    public string FileName { get; set; } = null!;

    public long FileSize { get; set; }

    public string FileUrl { get; set; } = null!;
}
