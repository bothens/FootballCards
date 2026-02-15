using Domain_Layer.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace Application_Layer.Common.Interfaces
{
    public interface ICardRepository
    {
        Task<Card> AddAsync(Card card, CancellationToken ct = default);
        Task<List<Card>> GetMarketCardsAsync(
            string? search,
            string? filter,
            string? sort,
            CancellationToken ct = default);
        Task<Card?> GetByIdAsync(int cardId, CancellationToken ct = default);
        Task<Card> UpdateAsync(Card card, CancellationToken ct = default);

        Task<List<Card>> GetPortfolioCardsAsync(
               int userId,
               string? search = null,
               string? filter = null,
               string? sort = null,
               CancellationToken ct = default);

        Task<List<Card>> GetAvailableCardsByTypesAsync(
            IEnumerable<string> cardTypes,
            CancellationToken ct = default);

        Task<List<Card>> GetCardsAsync(
            int? userId = null,
            bool onlyAvailable = false,
            string? search = null,
            string? filter = null,
            string? sort = null,
            CancellationToken ct = default);

        Task DeleteAsync(Card card, CancellationToken ct = default);
    }
}
