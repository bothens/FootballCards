using Domain_Layer.Entities;

namespace Application_Layer.Common.Interfaces
{
    public interface IPriceHistoryRepository
    {
        Task AddAsync(PriceHistory history, CancellationToken ct = default);
        Task<List<PriceHistory>> GetByPlayerIdAsync(int playerId, int take = 50, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}