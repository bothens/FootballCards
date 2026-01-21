using Domain_Layer.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure_Layer.Repositories.Interfaces
{
    public interface ICardRepository
    {
        Task<Card> AddAsync(Card card, CancellationToken ct = default);
    }
}
