using Domain_Layer.Entities;

namespace Application_Layer.Common.Interfaces
{
    public interface IPortfolioRepository
    {
        Task<Portfolio?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task<Portfolio> GetOrCreateByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
