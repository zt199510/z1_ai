using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Z1.Core;

public interface IUserContext
{
    string UserId { get; }

    T GetUser<T>();

    bool IsAuthenticated { get; }

    public string Role { get; }
}
