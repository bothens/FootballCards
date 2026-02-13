using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Trades.DTOs;
using Domain_Layer.Enums;
using MediatR;

namespace Application_Layer.Features.Trades.Commands.RejectOffer
{
    public sealed class RejectTradeOfferCommandHandler
        : IRequestHandler<RejectTradeOfferCommand, OperationResult<TradeOfferDto>>
    {
        private readonly ITradeOfferRepository _offers;

        public RejectTradeOfferCommandHandler(ITradeOfferRepository offers)
        {
            _offers = offers;
        }

        public async Task<OperationResult<TradeOfferDto>> Handle(
            RejectTradeOfferCommand request,
            CancellationToken cancellationToken)
        {
            var offer = await _offers.GetByIdAsync(request.TradeOfferId, cancellationToken);
            if (offer == null)
            {
                return OperationResult<TradeOfferDto>.Fail("Trade offer finns inte");
            }

            if (offer.ToUserId != request.UserId)
            {
                return OperationResult<TradeOfferDto>.Fail("Du kan inte avslå detta erbjudande");
            }

            if (offer.Status != TradeOfferStatus.Pending)
            {
                return OperationResult<TradeOfferDto>.Fail("Erbjudandet är redan hanterat");
            }

            offer.Status = TradeOfferStatus.Rejected;
            offer.RespondedAt = DateTime.UtcNow;
            await _offers.UpdateAsync(offer, cancellationToken);

            var dto = new TradeOfferDto
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
            };

            return OperationResult<TradeOfferDto>.Ok(dto);
        }
    }
}
