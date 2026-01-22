using Application_Layer.Common.Interfaces;
using Domain_Layer.Entities;
using Infrastructure_Layer.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer.Repositories.Implementations
{
    public sealed class CardRepository : ICardRepository
    {
        private readonly AppDbContext _db;

        public CardRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Card> AddAsync(Card card, CancellationToken ct = default)
        {
            await _db.Cards.AddAsync(card, ct);
            await _db.SaveChangesAsync(ct);
            return card;
        }

        public async Task<Card?> GetByIdAsync(
            int cardId,
            CancellationToken ct = default)
        {
            return await _db.Cards
                .Include(c => c.Player)
                .FirstOrDefaultAsync(c => c.CardId == cardId, ct);
        }

        public async Task<Card> UpdateAsync(
            Card card,
            CancellationToken ct = default)
        {
            _db.Cards.Update(card);
            await _db.SaveChangesAsync(ct);
            return card;
        }

        public async Task<List<Card>> GetCardsAsync(
            int? userId = null,
            bool onlyAvailable = false,
            string? search = null,
            string? filter = null,
            string? sort = null,
            CancellationToken ct = default)
        {
            var query = _db.Cards
                .Include(c => c.Player)
                .AsQueryable();

            if (onlyAvailable)
                query = query.Where(c => c.Status == "Available");

            if (userId.HasValue)
                query = query.Where(c => c.OwnerId == userId.Value); // båda int nu

            // Sök på Player.Name
            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.Trim().ToLower();
                query = query.Where(c => c.Player!.Name.ToLower().Contains(lowerSearch));
            }

            // Filtrering på CardType
            if (!string.IsNullOrWhiteSpace(filter))
            {
                query = filter.ToLower() switch
                {
                    "common" => query.Where(c => c.CardType == "Common"),
                    "rare" => query.Where(c => c.CardType == "Rare"),
                    "legendary" => query.Where(c => c.CardType == "Legendary"),
                    _ => query.Where(c => false)
                };
            }

            // Sortering
            query = sort?.ToLower() switch
            {
                "price_asc" => query.OrderBy(c => c.SellingPrice),
                "price_desc" => query.OrderByDescending(c => c.SellingPrice),
                "name_asc" => query.OrderBy(c => c.Player!.Name),
                "name_desc" => query.OrderByDescending(c => c.Player!.Name),
                _ => query.OrderBy(c => c.SellingPrice)
            };

            return await query.ToListAsync(ct);
        }


        public async Task<List<Card>> GetMarketCardsAsync(
            string? search,
            string? filter,
            string? sort,
            CancellationToken ct = default)
        {
            return await GetCardsAsync(onlyAvailable: true, search: search, filter: filter, sort: sort, ct: ct);
        }

        public async Task<List<Card>> GetPortfolioCardsAsync(
            int userId,
            string? search = null,
            string? filter = null,
            string? sort = null,
            CancellationToken ct = default)
        {
            return await GetCardsAsync(userId: userId, search: search, filter: filter, sort: sort, ct: ct);
        }
    }
}

