var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.Z1APIService_ApiService>("apiservice");

builder.AddProject<Projects.Z1APIService_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(apiService)
    .WaitFor(apiService);

builder.Build().Run();
