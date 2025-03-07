using Z1APIService.ApiService.Dto;

namespace Z1APIService.ApiService.Services.Chat.Param;

public class UpdateMessageParam
{
    public List<MessageTextParam> Texts { get; set; } = new();
}

public class MessageTextParam : EntityDto<long>
{
    public string Text { get; set; } = null!;
}
