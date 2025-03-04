using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;
using Z1.Core.Entities;
namespace Z1.Core;

public abstract class DbContextBase<TDbContext>(DbContextOptions<TDbContext> options, IUserContext userContext)
    : DbContext(options), IDbContext where TDbContext : DbContext
{
    public DbSet<User> Users { get; set; }

   

    public async Task SaveChangesAsync()
    {
        await SaveChangesAsync(new CancellationToken());
    }

    public virtual Task MigrateAsync()
    {
        return Task.CompletedTask;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseEntityConfiguration();

        base.OnModelCreating(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        BeforeSaveChanges();

        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        BeforeSaveChanges();
        return base.SaveChanges();
    }

    private void BeforeSaveChanges()
    {
        var entries = ChangeTracker.Entries().Where(x =>
            x.Entity is ICreation && (x.State == EntityState.Added || x.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            if (entry is { State: EntityState.Added, Entity: ICreation entity })
            {
                entity.CreatedAt = DateTime.Now;

                if (string.IsNullOrEmpty(entity.CreatedBy) && userContext.IsAuthenticated)
                {
                    entity.CreatedBy = userContext.UserId;
                }
            }
        }
    }
}