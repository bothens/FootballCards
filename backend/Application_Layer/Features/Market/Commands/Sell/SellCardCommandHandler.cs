using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
using Infrastructure_Layer.Repositories.Interfaces;
using MediatR;

namespace Application_Layer.Features.Market.Commands.Sell
{
    public sealed class SellCardCommandHandler
        : IRequestHandler<SellCardCommand, OperationResult<CardDto>>
    {
        private readonly ICardRepository _cardRepository;

        public SellCardCommandHandler(ICardRepository cardRepository)
        {
            _cardRepository = cardRepository;
        }

        public async Task<OperationResult<CardDto>> Handle(
            SellCardCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                // Hämta kortet
                var card = await _cardRepository.GetByIdAsync(request.CardId, cancellationToken);
                if (card == null)
                {
                    return OperationResult<CardDto>.Fail("Card not found");
                }

                // Validera ägare
                if (!card.OwnerId.HasValue || card.OwnerId.Value != request.SellerId)
                {
                    return OperationResult<CardDto>.Fail("You do not own this card");
                }

                // Validera att kortet inte redan ligger ute på marknaden
                if (card.Status == "Available")
                {
                    return OperationResult<CardDto>.Fail("Card is already listed on the market");
                }

                // Uppdatera kortets status och selling price
                card.SellingPrice = request.SellingPrice;
                card.Status = "Available";

                var updatedCard = await _cardRepository.UpdateAsync(card, cancellationToken);

                // Mappa till DTO
                var resultDto = new CardDto
                {
                    CardId = updatedCard.CardId,
                    PlayerId = updatedCard.PlayerId,
                    PlayerName = updatedCard.Player?.Name ?? string.Empty,
                    PlayerPosition = updatedCard.Player?.Position ?? string.Empty,
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
