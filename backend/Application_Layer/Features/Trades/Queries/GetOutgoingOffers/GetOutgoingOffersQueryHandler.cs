using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Trades.DTOs;
using MediatR;
using System.Linq;

namespace Application_Layer.Features.Trades.Queries.GetOutgoingOffers
{
    public sealed class GetOutgoingOffersQueryHandler
        : IRequestHandler<GetOutgoingOffersQuery, OperationResult<List<TradeOfferDto>>>
    {
        private readonly ITradeOfferRepository _offers;

        public GetOutgoingOffersQueryHandler(ITradeOfferRepository offers)
        {
            _offers = offers;
        }

        public async Task<OperationResult<List<TradeOfferDto>>> Handle(
            GetOutgoingOffersQuery request,
            CancellationToken cancellationToken)
        {
            var offers = await _offers.GetOutgoingAsync(request.UserId, cancellationToken);
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
