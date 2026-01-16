using System.Collections.Generic;
using System.Reflection.Emit;
using Domain_Layer.Entities;
using Domain_Layer.Relations;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer.Data
{
    public sealed class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Player> Players => Set<Player>();
        public DbSet<Transaction> Transactions => Set<Transaction>();
        public DbSet<Portfolio> Portfolios => Set<Portfolio>();
        public DbSet<PortfolioItem> PortfolioItems => Set<PortfolioItem>();
        public DbSet<PriceHistory> PriceHistories => Set<PriceHistory>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
