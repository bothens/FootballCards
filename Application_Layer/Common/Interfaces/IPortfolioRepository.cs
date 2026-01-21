using Domain_Layer.Entities;

namespace Infrastructure_Layer.Repositories.Interfaces
{
    public interface IPortfolioRepository
    {
        Task<Portfolio?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task<Portfolio> GetOrCreateByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
