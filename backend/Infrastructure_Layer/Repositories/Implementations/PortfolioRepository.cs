using Application_Layer.Common.Interfaces;
using Domain_Layer.Entities;
using Infrastructure_Layer.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer.Repositories.Implementations
{
    public sealed class PortfolioRepository : IPortfolioRepository
    {
        private readonly AppDbContext _db;

        public PortfolioRepository(AppDbContext db)
        {
            _db = db;
        }

        public Task<Portfolio?> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
            => _db.Portfolios
                .Include(x => x.Items)
                .FirstOrDefaultAsync(x => x.UserId == userId, ct);

        public async Task<Portfolio> GetOrCreateByUserIdAsync(Guid userId, CancellationToken ct = default)
        {
            var existing = await GetByUserIdAsync(userId, ct);
            if (existing != null) return existing;

            var portfolio = new Portfolio { UserId = userId, CreatedAt = DateTime.UtcNow };
            await _db.Portfolios.AddAsync(portfolio, ct);
            await _db.SaveChangesAsync(ct);

            return portfolio;
        }

        public Task SaveChangesAsync(CancellationToken ct = default)
            => _db.SaveChangesAsync(ct);
    }
}
