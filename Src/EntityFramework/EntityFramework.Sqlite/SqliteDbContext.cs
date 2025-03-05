using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Z1.Core;

namespace EntityFramework.Sqlite;

public class SqliteDbContext(DbContextOptions<SqliteDbContext> options, IUserContext userContext)
    : DbContextBase<SqliteDbContext>(options, userContext)
{
    public override async Task MigrateAsync()
    {
        await base.Database.MigrateAsync();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(warnings =>
            warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
            
        base.OnConfiguring(optionsBuilder);
    }
}
