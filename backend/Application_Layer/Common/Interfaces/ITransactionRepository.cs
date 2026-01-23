using Domain_Layer.Entities;
using MediatR;

namespace Application_Layer.Common.Interfaces
{
    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetByUserIdAsync(int userId, string? filter = null, CancellationToken ct = default);
        Task AddAsync(Transaction transaction, CancellationToken ct = default);
        Task<Transaction> UpdateAsync(Transaction transaction, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
