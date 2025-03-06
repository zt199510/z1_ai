var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.Z1APIService_ApiService>("apiservice");


builder.Build().Run();
