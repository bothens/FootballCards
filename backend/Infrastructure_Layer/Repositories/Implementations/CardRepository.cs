using Domain_Layer.Entities;
using Infrastructure_Layer.Data;
using Infrastructure_Layer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

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

        public async Task<List<Card>> GetMarketCardsAsync(
    string? search,
    string? filter,
    string? sort,
    CancellationToken ct = default)
        {
            // Alla kort som ligger ute på marknaden
            var query = _db.Cards
                .Include(c => c.Player)
                .Where(c => c.Status == "Available");

            // Trimma och lower-case på filter/sort
            filter = filter?.Trim().ToLower();
            sort = sort?.Trim().ToLower();

            // Case-insensitive search på Player.Name
            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.Trim().ToLower();
                query = query.Where(c => c.Player!.Name.ToLower().Contains(lowerSearch));
            }

            // Filtrering på CardType om filter-param finns
            if (!string.IsNullOrWhiteSpace(filter))
            {
                query = filter switch
                {
                    "common" => query.Where(c => c.CardType == "Common"),
                    "rare" => query.Where(c => c.CardType == "Rare"),
                    "legendary" => query.Where(c => c.CardType == "Legendary"),
                    _ => query.Where(c => false) // tom lista för okänd filter
                };
            }

            // Sortering på optional sort-param
            if (!string.IsNullOrWhiteSpace(sort))
            {
                query = sort switch
                {
                    "price_asc" => query.OrderBy(c => c.Price),
                    "price_desc" => query.OrderByDescending(c => c.Price),
                    "name_asc" => query.OrderBy(c => c.Player!.Name),
                    "name_desc" => query.OrderByDescending(c => c.Player!.Name),
                    _ => query
                };
            }
            else
            {
                // Default sort: pris stigande
                query = query.OrderBy(c => c.Price);
            }

            return await query.ToListAsync(ct);
        }
    }
}

