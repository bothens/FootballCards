using Domain_Layer.Entities;
using Infrastructure_Layer.Data;
using Infrastructure_Layer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer.Repositories.Implementations
{
    public sealed class PlayerRepository : IPlayerRepository
    {
        private readonly AppDbContext _db;

        public PlayerRepository(AppDbContext db)
        {
            _db = db;
        }

        public Task<List<Player>> GetAllAsync(CancellationToken ct = default)
            => _db.Players.AsNoTracking().OrderBy(x => x.Id).ToListAsync(ct);

        public Task<Player?> GetByIdAsync(int id, CancellationToken ct = default)
            => _db.Players.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);

        public Task<List<Player>> FilterAsync(string? team, string? position, decimal? minPrice, decimal? maxPrice, CancellationToken ct = default)
        {
            var q = _db.Players.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(team))
                q = q.Where(x => x.Team == team);

            if (!string.IsNullOrWhiteSpace(position))
                q = q.Where(x => x.Position == position);

            if (minPrice.HasValue)
                q = q.Where(x => x.CurrentPrice >= minPrice.Value);

            if (maxPrice.HasValue)
                q = q.Where(x => x.CurrentPrice <= maxPrice.Value);

            return q.OrderBy(x => x.Id).ToListAsync(ct);
        }

        public async Task<(int total, decimal avg, decimal max, decimal min)> GetStatsAsync(CancellationToken ct = default)
        {
            var total = await _db.Players.CountAsync(ct);
            if (total == 0) return (0, 0, 0, 0);

            var avg = await _db.Players.AverageAsync(x => x.CurrentPrice, ct);
            var max = await _db.Players.MaxAsync(x => x.CurrentPrice, ct);
            var min = await _db.Players.MinAsync(x => x.CurrentPrice, ct);

            return (total, avg, max, min);
        }

        public async Task UpdateAsync(Player player, CancellationToken ct = default)
        {
            _db.Players.Update(player);
            await _db.SaveChangesAsync(ct);
        }
    }
}
