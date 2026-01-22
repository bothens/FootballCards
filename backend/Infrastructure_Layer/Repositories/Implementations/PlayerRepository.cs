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

            return q.OrderBy(x => x.Id).ToListAsync(ct);
        }

        public async Task UpdateAsync(Player player, CancellationToken ct = default)
        {
            _db.Players.Update(player);
            await _db.SaveChangesAsync(ct);
        }

        public async Task AddAsync(Player player, CancellationToken ct = default)
        {
            _db.Players.Add(player);
            await _db.SaveChangesAsync(ct);
        }
    }
}
