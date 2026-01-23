using Domain_Layer.Entities;

namespace Application_Layer.Common.Interfaces
{
    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task AddAsync(Transaction transaction, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
