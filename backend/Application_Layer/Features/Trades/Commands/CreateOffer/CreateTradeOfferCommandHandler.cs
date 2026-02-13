using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Trades.DTOs;
using Domain_Layer.Entities;
using Domain_Layer.Enums;
using MediatR;

namespace Application_Layer.Features.Trades.Commands.CreateOffer
{
    public sealed class CreateTradeOfferCommandHandler
        : IRequestHandler<CreateTradeOfferCommand, OperationResult<TradeOfferDto>>
    {
        private readonly ITradeOfferRepository _offers;
        private readonly IFriendRequestRepository _friendRequests;
        private readonly ICardRepository _cards;
        private readonly IUserRepository _users;

        public CreateTradeOfferCommandHandler(
            ITradeOfferRepository offers,
            IFriendRequestRepository friendRequests,
            ICardRepository cards,
            IUserRepository users)
        {
            _offers = offers;
            _friendRequests = friendRequests;
            _cards = cards;
            _users = users;
        }

        public async Task<OperationResult<TradeOfferDto>> Handle(
            CreateTradeOfferCommand request,
            CancellationToken cancellationToken)
        {
            if (request.FromUserId == request.ToUserId)
            {
                return OperationResult<TradeOfferDto>.Fail("Du kan inte erbjuda dig själv");
            }

            var friendship = await _friendRequests.GetBetweenAsync(request.FromUserId, request.ToUserId, cancellationToken);
            if (friendship == null || friendship.Status != FriendRequestStatus.Accepted)
            {
                return OperationResult<TradeOfferDto>.Fail("Ni är inte vänner");
            }

            var card = await _cards.GetByIdAsync(request.CardId, cancellationToken);
            if (card == null)
            {
                return OperationResult<TradeOfferDto>.Fail("Kort inte funnet");
            }

            if (card.OwnerId != request.FromUserId || card.Status != "Owned")
            {
                return OperationResult<TradeOfferDto>.Fail("Kortet är inte tillgängligt för trade");
            }

            var offer = new TradeOffer
            {
                FromUserId = request.FromUserId,
                ToUserId = request.ToUserId,
                CardId = request.CardId,
                Price = request.Price,
                Status = TradeOfferStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _offers.AddAsync(offer, cancellationToken);

            var fromUser = await _users.GetByIdAsync(request.FromUserId, cancellationToken);
            var toUser = await _users.GetByIdAsync(request.ToUserId, cancellationToken);

            var dto = new TradeOfferDto
            {
                TradeOfferId = offer.TradeOfferId,
                FromUserId = offer.FromUserId,
                ToUserId = offer.ToUserId,
                FromUserName = fromUser?.DisplayName ?? string.Empty,
                ToUserName = toUser?.DisplayName ?? string.Empty,
                CardId = offer.CardId,
                CardPlayerName = card.Player?.Name ?? string.Empty,
                CardImageUrl = card.ImageUrl ?? card.Player?.ImageUrl ?? string.Empty,
                Price = offer.Price,
                Status = offer.Status.ToString(),
                CreatedAt = offer.CreatedAt
            };

            return OperationResult<TradeOfferDto>.Ok(dto);
        }
    }
}
