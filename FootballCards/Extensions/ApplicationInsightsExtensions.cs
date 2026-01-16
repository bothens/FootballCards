namespace FootballCards.Extensions
{
    public static class ApplicationInsightsExtensions
    {
        public static IServiceCollection AddFootballCardsApplicationInsights(this IServiceCollection services, IConfiguration config)
        {
            var cs = config["ApplicationInsights:ConnectionString"];
            if (!string.IsNullOrWhiteSpace(cs))
            {
                services.AddApplicationInsightsTelemetry(o => o.ConnectionString = cs);
            }

            return services;
        }
    }
}
