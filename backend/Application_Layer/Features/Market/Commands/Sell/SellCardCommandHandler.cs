using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
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
                    return OperationResult<CardDto>.Fail("Kort inte funnet");
                }

                // Validera ägare
                if (!card.OwnerId.HasValue || card.OwnerId.Value != request.SellerId)
                {
                    return OperationResult<CardDto>.Fail("Du äger inte detta kortet");
                }

                // Validera att kortet inte redan ligger ute på marknaden
                if (card.Status == "Available")
                {
                    return OperationResult<CardDto>.Fail("Kortet är redan ute till försäljning");
                }

                // Uppdatera kortets status och selling price
                card.SellingPrice = request.SellingPrice;
                card.Status = "Available";
                card.HighestBid = null;
                card.HighestBidderId = null;

                var updatedCard = await _cardRepository.UpdateAsync(card, cancellationToken);

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
