using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Market.DTOs;
using MediatR;


namespace Application_Layer.Features.Market.Queries
{
    public sealed class GetMarketCardsQueryHandler
        : IRequestHandler<GetMarketCardsQuery, OperationResult<List<MarketCardDto>>>
    {
        private readonly ICardRepository _cardRepository;

        public GetMarketCardsQueryHandler(ICardRepository cardRepository)
        {
            _cardRepository = cardRepository;
        }

        public async Task<OperationResult<List<MarketCardDto>>> Handle(
            GetMarketCardsQuery request,
            CancellationToken cancellationToken)
        {
            try
            {
                // Hämta kort från repository med optional search + filter
                var cards = await _cardRepository.GetMarketCardsAsync(
                    request.Search,
                    request.Filter,
                    request.Sort,
                    cancellationToken);

                // Mappa entiteter till DTO
                var result = cards.Select(c => new MarketCardDto
                {
                    CardId = c.CardId,
                    PlayerId = c.PlayerId,
                    PlayerName = c.Player!.Name,
                    PlayerPosition = c.Player.Position,
                    SellingPrice = c.SellingPrice ?? c.Price,
                    Status = c.Status,
                    CardType = c.CardType
                }).ToList();

                return OperationResult<List<MarketCardDto>>.Ok(result);
            }
            catch (Exception ex)
            {
                return OperationResult<List<MarketCardDto>>.Fail(
                    ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
