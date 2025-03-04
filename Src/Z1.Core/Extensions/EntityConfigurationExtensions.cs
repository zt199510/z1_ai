using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using Z1.Core.Entities;

namespace Z1.Core.Extensions;

public static class EntityConfigurationExtensions
{
    public static ModelBuilder UseEntityConfiguration(this ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(EntityConfigurationExtensions).Assembly);
        return modelBuilder;
    }

    public static void UseEntityConfiguration<T>(this EntityTypeBuilder<T> modelBuilder) where T : class, ICreation
    {
        modelBuilder.Property(x => x.CreatedAt)
            .IsRequired();

        modelBuilder.Property(x => x.CreatedBy).HasMaxLength(50);

        modelBuilder.Property(x => x.CreatedBy).IsRequired(false);

        modelBuilder.HasIndex(x => x.CreatedBy);
    }
}