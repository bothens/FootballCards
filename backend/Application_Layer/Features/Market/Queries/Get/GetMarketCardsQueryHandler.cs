using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
using Application_Layer.Features.Market.Queries;
using MediatR;

namespace Application_Layer.Features.Market.Handlers
{
    public sealed class GetMarketCardsQueryHandler
        : IRequestHandler<GetMarketCardsQuery, OperationResult<List<CardDto>>>
    {
        private readonly ICardRepository _cardRepository;

        public GetMarketCardsQueryHandler(ICardRepository cardRepository)
        {
            _cardRepository = cardRepository;
        }

        public async Task<OperationResult<List<CardDto>>> Handle(
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
                var result = cards.Select(c => new CardDto
                {
                    CardId = c.CardId,
                    PlayerId = c.PlayerId,
                    PlayerName = c.Player!.Name,
                    PlayerPosition = c.Player.Position,
                    Price = c.Price,
                    OwnerId = c.OwnerId,
                    Status = c.Status,
                    CardType = c.CardType
                }).ToList();

                return OperationResult<List<CardDto>>.Ok(result);
            }
            catch (Exception ex)
            {
                return OperationResult<List<CardDto>>.Fail(
                    ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
