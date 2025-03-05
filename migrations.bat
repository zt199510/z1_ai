@echo off
set MIGRATION_NAME=Initial

set ConnectionStrings:Type=sqlite
dotnet ef migrations add --project src\EntityFramework\EntityFramework.Sqlite\EntityFramework.Sqlite.csproj --startup-project src\Z1APIService.ApiService\Z1APIService.ApiService.csproj --context EntityFramework.Sqlite.SqliteDbContext --configuration Debug --verbose %MIGRATION_NAME% --output-dir Migrations\

