using Domain_Layer.Entities;

namespace Application_Layer.Common.Interfaces
{
    public interface ITradeOfferRepository
    {
        Task AddAsync(TradeOffer offer, CancellationToken ct = default);
        Task<TradeOffer?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<List<TradeOffer>> GetIncomingAsync(int userId, CancellationToken ct = default);
        Task<List<TradeOffer>> GetOutgoingAsync(int userId, CancellationToken ct = default);
        Task<TradeOffer> UpdateAsync(TradeOffer offer, CancellationToken ct = default);
    }
}
