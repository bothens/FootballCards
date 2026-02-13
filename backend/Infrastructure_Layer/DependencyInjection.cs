using Application_Layer.Common.Interfaces;
using Application_Layer.Services;
using Infrastructure_Layer.Auth;
using Infrastructure_Layer.Data;
using Infrastructure_Layer.Repositories.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure_layer
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            // DB-koppling (SQL Server)
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

            services.AddHttpContextAccessor();

            // Auth / Users
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IPasswordHasher, PasswordHasher>();

            // Repositories
            services.AddScoped<IPlayerRepository, PlayerRepository>();
            services.AddScoped<ITransactionRepository, TransactionRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ICardRepository, CardRepository>();
            services.AddScoped<IFriendRequestRepository, FriendRequestRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<ITradeOfferRepository, TradeOfferRepository>();

            return services;
        }
    }
}
