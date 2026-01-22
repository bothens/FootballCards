using Serilog;

namespace FootballCards.API.Extensions
{
    public static class SerilogExtensions
    {
        public static IHostBuilder UseFootballCardsSerilog(this IHostBuilder host, IConfiguration config)
        {
            host.UseSerilog((context, services, loggerConfig) =>
            {
                loggerConfig
                    .ReadFrom.Configuration(context.Configuration)
                    .Enrich.FromLogContext()
                    .WriteTo.Console();
            });

            return host;
        }
    }
}
