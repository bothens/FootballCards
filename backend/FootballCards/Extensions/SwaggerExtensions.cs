using Microsoft.OpenApi.Models;
using Microsoft.Extensions.DependencyInjection;


namespace FootballCards.API.Extensions
{
    public static class SwaggerExtensions
    {
        public static IServiceCollection AddFootballCardsSwagger(this IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "FootballCards API",
                    Version = "v1"
                });
            });

            return services;
        }
    }
}
