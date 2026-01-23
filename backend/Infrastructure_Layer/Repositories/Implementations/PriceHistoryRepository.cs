
//using Domain_Layer.Entities;
//using Infrastructure_Layer.Data;
//using Infrastructure_Layer.Repositories.Interfaces;
//using Microsoft.EntityFrameworkCore;

//namespace Infrastructure_Layer.Repositories.Implementations
//{
//    public sealed class PriceHistoryRepository : IPriceHistoryRepository
//    {
//        private readonly AppDbContext _db;

//        public PriceHistoryRepository(AppDbContext db)
//        {
//            _db = db;
//        }

//        public async Task AddAsync(PriceHistory history, CancellationToken ct = default)
//        {
//            await _db.PriceHistories.AddAsync(history, ct);
//        }

//        public Task<List<PriceHistory>> GetByPlayerIdAsync(int playerId, int take = 50, CancellationToken ct = default)
//            => _db.PriceHistories
//                .AsNoTracking()
//                .Where(x => x.PlayerId == playerId)
//                .OrderByDescending(x => x.Timestamp)
//                .Take(take)
//                .ToListAsync(ct);

//        public Task SaveChangesAsync(CancellationToken ct = default)
//            => _db.SaveChangesAsync(ct);
//    }
//}
