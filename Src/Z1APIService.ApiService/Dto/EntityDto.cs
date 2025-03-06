using Z1.Core.Entities;

namespace Z1APIService.ApiService.Dto;

public abstract class EntityDto<TKey> : ICreation
{
    public TKey Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? CreatedBy { get; set; }
}
