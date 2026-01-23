using Domain_Layer.Entities;
using Infrastructure_Layer.Data;
using Application_Layer.Common.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer.Repositories.Implementations
{
    public sealed class TransactionRepository : ITransactionRepository
    {
        private readonly AppDbContext _db;

        public TransactionRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<Transaction>> GetByUserIdAsync(int userId,string filter, CancellationToken ct = default)
        {
            IQueryable<Transaction> query = _db.Transactions
                .Include(t => t.Card)
                .ThenInclude(c => c.Player);

            filter = filter?.ToLower();

            if (filter == "buyer")
            {
                query = query.Where(t => t.BuyerId == userId);
            }
            else if (filter == "seller")
            {
                query = query.Where(t => t.SellerId == userId);
            }
            else
            {
                query = query.Where(t => t.BuyerId == userId || t.SellerId == userId);
            }

            return await query
                .OrderByDescending(t => t.Date)
                .ToListAsync(ct);
        }

        public async Task AddAsync(Transaction transaction, CancellationToken ct = default)
        {
                await _db.Transactions.AddAsync(transaction, ct);
                await _db.SaveChangesAsync(ct);
        }

        public Task SaveChangesAsync(CancellationToken ct = default)
            => _db.SaveChangesAsync(ct);
    }
}
