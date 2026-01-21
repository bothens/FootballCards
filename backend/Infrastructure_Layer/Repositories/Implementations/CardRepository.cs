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
    }
}
