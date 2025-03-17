using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Z1.Core.Entities.Configurations;

public class UserPromptConfigurations : IEntityTypeConfiguration<UserPrompt>
{
    public void Configure(EntityTypeBuilder<UserPrompt> builder)
    {
        builder.ToTable("UserPrompt");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(x => x.Description)
            .HasMaxLength(200);

        builder.Property(x => x.Prompt)
            .HasMaxLength(-1);

        builder.Property(x => x.UserId)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.CreatedBy)
            .HasMaxLength(50);

        builder.HasIndex(x => x.UserId);

        builder.UseEntityConfiguration();

    }
}
