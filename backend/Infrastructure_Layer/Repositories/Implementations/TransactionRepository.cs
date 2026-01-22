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

        public Task<List<Transaction>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
            => _db.Transactions
                .AsNoTracking()
                //.Where(x => x.UserId == userId)
                //.OrderByDescending(x => x.CreatedAt)
                .ToListAsync(ct);

        public async Task AddAsync(Transaction transaction, CancellationToken ct = default)
        {
            await _db.Transactions.AddAsync(transaction, ct);
        }

        public Task SaveChangesAsync(CancellationToken ct = default)
            => _db.SaveChangesAsync(ct);
    }
}
