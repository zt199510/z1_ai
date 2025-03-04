using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;
using Z1.Core.Entities;

namespace Z1.Core;

public interface IDbContext
{
    DbSet<User> Users { get; set; }
    Task SaveChangesAsync();
    Task MigrateAsync();
}
