using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Z1.Core.Entities.Configurations;

public class MessageModelUsageEntityConfigurations : IEntityTypeConfiguration<MessageModelUsage>
{
    public void Configure(EntityTypeBuilder<MessageModelUsage> builder)
    {
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        
        builder.HasIndex(x => x.MessageId);
        
        builder.UseEntityConfiguration();
    }
}