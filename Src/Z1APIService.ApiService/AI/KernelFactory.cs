﻿using Microsoft.SemanticKernel;
using System.Collections.Concurrent;
#pragma warning disable SKEXP0070
#pragma warning disable SKEXP0010
namespace Z1APIService.ApiService.AI;

public class KernelFactory
{
    private static readonly ConcurrentDictionary<string, Lazy<Kernel>> Kernels = new();
    public static Kernel CreateKernel(string model, string endpoint, string? apiKey, string provider)
    {

        var key = model + endpoint + apiKey + provider;
        return Kernels.GetOrAdd(key, ValueFactory).Value;
        Lazy<Kernel> ValueFactory(string key)
        {
            return new Lazy<Kernel>(() =>
            {
                var kernelBuilder = Kernel.CreateBuilder();

                kernelBuilder.Plugins.AddFromPromptDirectory(
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "plugins", "Chat"), "Chat");

                switch (provider.ToLower())
                {
                    case "openai":
                    case "deepseek":
                    case "grok":
                    case "custom":
                    case "siliconcloud":
                        kernelBuilder.AddOpenAIChatCompletion(model, new Uri(endpoint), apiKey, "z1-Chat");
                        break;
                    case "azure":
                        kernelBuilder.AddAzureOpenAIChatCompletion(model, endpoint, apiKey);
                        break;
                    case "google":
                        kernelBuilder.AddGoogleAIGeminiChatCompletion(model, apiKey);
                        break;
                    case "ollama":
                        kernelBuilder.AddOllamaChatCompletion(model, new Uri(endpoint));
                        break;
                    default:
                        kernelBuilder.AddOpenAIChatCompletion(model, new Uri(endpoint), apiKey, "z1-Chat");
                        break;
                }
                return kernelBuilder.Build();
            });
        }
    }
}
