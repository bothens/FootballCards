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
        public DbSet<Card> Cards => Set<Card>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

            
            modelBuilder.Entity<User>().ToTable("User", "dbo");
            modelBuilder.Entity<Player>().ToTable("Player", "dbo");
            modelBuilder.Entity<Transaction>().ToTable("Transaction", "dbo");
            modelBuilder.Entity<Portfolio>().ToTable("Portfolio", "dbo");
            modelBuilder.Entity<Card>().ToTable("Card", "dbo");

        }
    }
}
