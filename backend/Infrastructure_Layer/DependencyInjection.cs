using Application_Layer.Common.Interfaces;
using Infrastructure_Layer.Auth;
using Application_Layer.Services;
using Infrastructure_layer.Auth;
using Infrastructure_Layer.Data;
using Infrastructure_Layer.Repositories.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore.SqlServer;

namespace Infrastructure_Layer
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

            services.AddHttpContextAccessor();

            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();

            services.AddScoped<IPlayerRepository, PlayerRepository>();
            //services.AddScoped<IPortfolioRepository, PortfolioRepository>();
            services.AddScoped<ITransactionRepository, TransactionRepository>();
            //services.AddScoped<IPriceHistoryRepository, PriceHistoryRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ICardRepository, CardRepository>();

            return services;
        }
    }
}
