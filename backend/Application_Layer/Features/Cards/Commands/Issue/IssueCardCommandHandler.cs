using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.Commands.Issue;
using Application_Layer.Features.Cards.DTOs;
using Domain_Layer.Entities;
using MediatR;

namespace Application_Layer.Features.Cards.Commands.Issue
{
    public sealed class IssueCardCommandHandler
        : IRequestHandler<IssueCardCommand, OperationResult<CardDto>>
    {
        private readonly ICardRepository _cardRepository;
        private readonly IPlayerRepository _playerRepository;

        public IssueCardCommandHandler(ICardRepository cardRepository, IPlayerRepository playerRepository)
        {
            _cardRepository = cardRepository;
            _playerRepository = playerRepository;
        }

        public async Task<OperationResult<CardDto>> Handle(
            IssueCardCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var dto = request.Card;

            // Hämta spelaren
            var player = await _playerRepository.GetByIdAsync(dto.PlayerId, cancellationToken);
            if (player == null)
                return OperationResult<CardDto>.Fail("Spelare inte funnen");

                // ---------------------------------------------------------
                // MOCK ADMIN IMPLEMENTATION
                // ---------------------------------------------------------
                // Alla kort som skapas via denna endpoint tilldelas hårdkodat OwnerId = 8.
                // Detta motsvarar “admin” på ytan, eftersom vi inte har enums eller rollhantering.
                // I frontend kan ni kontrollera UserId == 8 för att visa admin-sidor/funktioner.
                // När vi senare implementerar riktiga roller/claims kan detta uppdateras.
                // ---------------------------------------------------------
                // Skapa kortet med hårdkodat admin som ägare
                var card = new Card
                {
                PlayerId = dto.PlayerId,
                OwnerId = 8,
                Status = "Available",
                CardType = dto.CardType ?? "Common",
                Price = dto.Price,
                SellingPrice = dto.Price
                };

            var addedCard = await _cardRepository.AddAsync(card, cancellationToken);

            // Returnera DTO med player-info
            var resultDto = new CardDto
            {
                CardId = addedCard.CardId,
                PlayerId = player.Id,
                PlayerName = player.Name,
                PlayerPosition = player.Position,
                PlayerImageUrl = player.ImageUrl,
                Price = addedCard.Price,
                SellingPrice = addedCard.SellingPrice,
                OwnerId = addedCard.OwnerId,
                Status = addedCard.Status,
                CardType = addedCard.CardType
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
