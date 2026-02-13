using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Trades.DTOs;
using Domain_Layer.Entities;
using Domain_Layer.Enums;
using MediatR;
using System;

namespace Application_Layer.Features.Trades.Commands.AcceptOffer
{
    public sealed class AcceptTradeOfferCommandHandler
        : IRequestHandler<AcceptTradeOfferCommand, OperationResult<TradeOfferDto>>
    {
        private readonly ITradeOfferRepository _offers;
        private readonly ICardRepository _cards;
        private readonly IUserRepository _users;
        private readonly ITransactionRepository _transactions;

        public AcceptTradeOfferCommandHandler(
            ITradeOfferRepository offers,
            ICardRepository cards,
            IUserRepository users,
            ITransactionRepository transactions)
        {
            _offers = offers;
            _cards = cards;
            _users = users;
            _transactions = transactions;
        }

        public async Task<OperationResult<TradeOfferDto>> Handle(
            AcceptTradeOfferCommand request,
            CancellationToken cancellationToken)
        {
            var offer = await _offers.GetByIdAsync(request.TradeOfferId, cancellationToken);
            if (offer == null)
            {
                return OperationResult<TradeOfferDto>.Fail("Trade offer finns inte");
            }

            if (offer.ToUserId != request.UserId)
            {
                return OperationResult<TradeOfferDto>.Fail("Du kan inte acceptera detta erbjudande");
            }

            if (offer.Status != TradeOfferStatus.Pending)
            {
                return OperationResult<TradeOfferDto>.Fail("Erbjudandet är redan hanterat");
            }

            var card = await _cards.GetByIdAsync(offer.CardId, cancellationToken);
            if (card == null || card.OwnerId != offer.FromUserId || card.Status != "Owned")
            {
                return OperationResult<TradeOfferDto>.Fail("Kortet är inte längre tillgängligt");
            }

            var buyer = await _users.GetByIdAsync(offer.ToUserId, cancellationToken);
            var seller = await _users.GetByIdAsync(offer.FromUserId, cancellationToken);
            if (buyer == null || seller == null)
            {
                return OperationResult<TradeOfferDto>.Fail("User not found");
            }

            var price = offer.Price ?? 0m;
            if (price > 0 && buyer.Balance < price)
            {
                return OperationResult<TradeOfferDto>.Fail("Insufficient balance");
            }

            if (price > 0)
            {
                buyer.Balance -= price;
                seller.Balance += price;
                await _users.UpdateAsync(buyer, cancellationToken);
                await _users.UpdateAsync(seller, cancellationToken);
            }

            card.OwnerId = buyer.UserId;
            card.Status = "Owned";
            card.SellingPrice = null;
            card.HighestBid = null;
            card.HighestBidderId = null;
            await _cards.UpdateAsync(card, cancellationToken);

            offer.Status = TradeOfferStatus.Accepted;
            offer.RespondedAt = DateTime.UtcNow;
            await _offers.UpdateAsync(offer, cancellationToken);

            var transaction = new Transaction
            {
                BuyerId = buyer.UserId,
                SellerId = seller.UserId,
                CardId = card.CardId,
                Price = price,
                Date = DateTime.UtcNow
            };
            await _transactions.AddAsync(transaction, cancellationToken);

            var dto = new TradeOfferDto
            {
                TradeOfferId = offer.TradeOfferId,
                FromUserId = offer.FromUserId,
                ToUserId = offer.ToUserId,
                FromUserName = seller.DisplayName,
                ToUserName = buyer.DisplayName,
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
