using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
using Domain_Layer.Entities;
using MediatR;

namespace Application_Layer.Features.Market.Commands.Purchase
{
    public sealed class PurchaseCardCommandHandler
        : IRequestHandler<PurchaseCardCommand, OperationResult<CardDto>>
    {
        private readonly ICardRepository _cardRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IUserRepository _userRepository;

        public PurchaseCardCommandHandler(
            ICardRepository cardRepository,
            ITransactionRepository transactionRepository,
            IUserRepository userRepository)
        {
            _cardRepository = cardRepository;
            _transactionRepository = transactionRepository;
            _userRepository = userRepository;
        }

        public async Task<OperationResult<CardDto>> Handle(
            PurchaseCardCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                // Hämta kortet
                var card = await _cardRepository.GetByIdAsync(
                    request.CardId,
                    cancellationToken);

                if (card == null)
                {
                    return OperationResult<CardDto>.Fail("Kort inte funnet");
                }

                // Validera status + pris
                if (card.Status != "Available")
                {
                    return OperationResult<CardDto>.Fail("Kort är inte tillgängligt att köpa");
                }

                if (card.SellingPrice == null)
                {
                    return OperationResult<CardDto>.Fail("Kort har inget försäljningspris");
                }

                // Validera att man inte köper sitt eget kort
                if (card.OwnerId.HasValue && card.OwnerId.Value == request.BuyerId)
                {
                    return OperationResult<CardDto>.Fail("Du kan inte köpa ditt egna kort");
                }

                var sellerId = card.OwnerId;
                var price = card.SellingPrice.Value;

                var buyer = await _userRepository.GetByUserIdAsync(request.BuyerId, cancellationToken);
                if (buyer == null)
                {
                    return OperationResult<CardDto>.Fail("User not found");
                }

                if (buyer.Balance < price)
                {
                    return OperationResult<CardDto>.Fail("Insufficient balance");
                }

                // Uppdatera kortet
                card.OwnerId = request.BuyerId;
                card.Price = price;
                card.SellingPrice = null;
                card.Status = "Owned";
                card.HighestBid = null;
                card.HighestBidderId = null;

                buyer.Balance -= price;
                await _userRepository.UpdateAsync(buyer, cancellationToken);

                if (sellerId.HasValue)
                {
                    var seller = await _userRepository.GetByUserIdAsync(sellerId.Value, cancellationToken);
                    if (seller != null)
                    {
                        seller.Balance += price;
                        await _userRepository.UpdateAsync(seller, cancellationToken);
                    }
                }

                var updatedCard = await _cardRepository.UpdateAsync(
                    card,
                    cancellationToken);

                // Skapa transaction
                var transaction = new Transaction
                {
                    BuyerId = request.BuyerId,
                    SellerId = sellerId,
                    CardId = card.CardId,
                    Price = price,
                    Date = DateTime.UtcNow
                };

                await _transactionRepository.AddAsync(
                    transaction,
                    cancellationToken);

                // Mappa till DTO
                var resultDto = new CardDto
                {
                    CardId = updatedCard.CardId,
                    PlayerId = updatedCard.PlayerId,
                    PlayerName = updatedCard.Player?.Name ?? string.Empty,
                    PlayerTeam = updatedCard.Player?.Team ?? string.Empty,
                    PlayerPosition = updatedCard.Player?.Position ?? string.Empty,
                    PlayerImageUrl = updatedCard.Player?.ImageUrl ?? string.Empty,
                    CardImageUrl = updatedCard.ImageUrl ?? updatedCard.Player?.ImageUrl ?? string.Empty,
                    Facts = updatedCard.Facts,
                    FactsEn = updatedCard.FactsEn,
                    Price = updatedCard.Price,
                    OwnerId = updatedCard.OwnerId,
                    Status = updatedCard.Status,
                    CardType = updatedCard.CardType
                };

                return OperationResult<CardDto>.Ok(resultDto);
            }
            catch (Exception ex)
            {
                return OperationResult<CardDto>.Fail(
                    ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
