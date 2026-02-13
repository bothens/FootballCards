using Application_Layer.Common.Interfaces;
using Domain_Layer.Entities;
using Infrastructure_Layer.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer.Repositories.Implementations
{
    public sealed class TradeOfferRepository : ITradeOfferRepository
    {
        private readonly AppDbContext _db;

        public TradeOfferRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(TradeOffer offer, CancellationToken ct = default)
        {
            await _db.TradeOffers.AddAsync(offer, ct);
            await _db.SaveChangesAsync(ct);
        }

        public Task<TradeOffer?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            return _db.TradeOffers
                .Include(o => o.FromUser)
                .Include(o => o.ToUser)
                .Include(o => o.Card)
                .ThenInclude(c => c.Player)
                .FirstOrDefaultAsync(o => o.TradeOfferId == id, ct);
        }

        public Task<List<TradeOffer>> GetIncomingAsync(int userId, CancellationToken ct = default)
        {
            return _db.TradeOffers
                .Include(o => o.FromUser)
                .Include(o => o.Card)
                .ThenInclude(c => c.Player)
                .Where(o => o.ToUserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync(ct);
        }

        public Task<List<TradeOffer>> GetOutgoingAsync(int userId, CancellationToken ct = default)
        {
            return _db.TradeOffers
                .Include(o => o.ToUser)
                .Include(o => o.Card)
                .ThenInclude(c => c.Player)
                .Where(o => o.FromUserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync(ct);
        }

        public async Task<TradeOffer> UpdateAsync(TradeOffer offer, CancellationToken ct = default)
        {
            _db.TradeOffers.Update(offer);
            await _db.SaveChangesAsync(ct);
            return offer;
        }
    }
}
