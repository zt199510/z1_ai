

using Microsoft.EntityFrameworkCore;

namespace EntityFramework.Sqlite;

public class SqliteDbContext(DbContextOptions<SqliteDbContext> options, IUserContext userContext)
    : DbContextBase<SqliteDbContext>(options, userContext)
{
    public override async Task MigrateAsync()
    {
        await base.Database.MigrateAsync();

    }
}
