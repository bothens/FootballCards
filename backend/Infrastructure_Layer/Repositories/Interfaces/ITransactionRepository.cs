using Domain_Layer.Entities;

namespace Infrastructure_Layer.Repositories.Interfaces
{
    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task AddAsync(Transaction transaction, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
