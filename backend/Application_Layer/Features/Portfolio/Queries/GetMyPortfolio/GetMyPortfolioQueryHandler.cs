using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
using MediatR;

namespace Application_Layer.Features.Portfolio.Queries.GetMyPortfolio
{
    public sealed class GetMyPortfolioQueryHandler
    : IRequestHandler<GetMyPortfolioQuery, OperationResult<List<CardDto>>>
    {
        private readonly ICardRepository _cardRepository;

        public GetMyPortfolioQueryHandler(ICardRepository cardRepository)
        {
            _cardRepository = cardRepository;
        }

        public async Task<OperationResult<List<CardDto>>> Handle(
            GetMyPortfolioQuery request,
            CancellationToken cancellationToken)
        {
            try
            {
                var cards = await _cardRepository.GetPortfolioCardsAsync(
                    request.UserId,
                    request.Search,
                    request.Filter,
                    request.Sort,
                    cancellationToken
                );

                var result = cards.Select(c => new CardDto
                {
                    CardId = c.CardId,
                    PlayerId = c.PlayerId,
                    PlayerName = c.Player?.Name ?? string.Empty,
                    PlayerPosition = c.Player?.Position ?? string.Empty,
                    Price = c.Price,
                    SellingPrice = c.SellingPrice,
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