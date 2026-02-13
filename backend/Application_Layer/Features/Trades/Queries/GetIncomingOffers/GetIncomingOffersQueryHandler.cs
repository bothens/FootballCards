using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Trades.DTOs;
using MediatR;
using System.Linq;

namespace Application_Layer.Features.Trades.Queries.GetIncomingOffers
{
    public sealed class GetIncomingOffersQueryHandler
        : IRequestHandler<GetIncomingOffersQuery, OperationResult<List<TradeOfferDto>>>
    {
        private readonly ITradeOfferRepository _offers;

        public GetIncomingOffersQueryHandler(ITradeOfferRepository offers)
        {
            _offers = offers;
        }

        public async Task<OperationResult<List<TradeOfferDto>>> Handle(
            GetIncomingOffersQuery request,
            CancellationToken cancellationToken)
        {
            var offers = await _offers.GetIncomingAsync(request.UserId, cancellationToken);
            var result = offers.Select(offer => new TradeOfferDto
            {
                TradeOfferId = offer.TradeOfferId,
                FromUserId = offer.FromUserId,
                ToUserId = offer.ToUserId,
                FromUserName = offer.FromUser.DisplayName,
                ToUserName = offer.ToUser.DisplayName,
                CardId = offer.CardId,
                CardPlayerName = offer.Card.Player?.Name ?? string.Empty,
                CardImageUrl = offer.Card.ImageUrl ?? offer.Card.Player?.ImageUrl ?? string.Empty,
                Price = offer.Price,
                Status = offer.Status.ToString(),
                CreatedAt = offer.CreatedAt
            }).ToList();

            return OperationResult<List<TradeOfferDto>>.Ok(result);
        }
    }
}
