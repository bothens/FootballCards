using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
using Application_Layer.Features.Market.DTOs;
using Domain_Layer.Entities;
using MediatR;

namespace Application_Layer.Features.Market.Commands.OpenPack
{
    public sealed class OpenPackCommandHandler
        : IRequestHandler<OpenPackCommand, OperationResult<OpenPackResultDto>>
    {
        private sealed record PackConfig(string Key, decimal Price, IReadOnlyList<string> AllowedCardTypes);

        private static readonly PackConfig[] PackConfigs =
        {
            new(
                Key: "starter",
                Price: 250m,
                AllowedCardTypes: new[] { "Common", "Rare", "Epic", "Legendary", "Skiller", "Historical Moment" }),
            new(
                Key: "premium",
                Price: 500m,
                AllowedCardTypes: new[] { "Rare", "Epic", "Legendary", "Skiller", "Historical Moment" }),
            new(
                Key: "elite",
                Price: 1000m,
                AllowedCardTypes: new[] { "Skiller", "Historical Moment" }),
        };

        private readonly ICardRepository _cardRepository;
        private readonly IUserRepository _userRepository;
        private readonly ITransactionRepository _transactionRepository;

        public OpenPackCommandHandler(
            ICardRepository cardRepository,
            IUserRepository userRepository,
            ITransactionRepository transactionRepository)
        {
            _cardRepository = cardRepository;
            _userRepository = userRepository;
            _transactionRepository = transactionRepository;
        }

        public async Task<OperationResult<OpenPackResultDto>> Handle(
            OpenPackCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var config = ResolvePackConfig(request.PackType);
                if (config == null)
                {
                    return OperationResult<OpenPackResultDto>.Fail("Unknown pack type");
                }

                var user = await _userRepository.GetByUserIdAsync(request.UserId, cancellationToken);
                if (user == null)
                {
                    return OperationResult<OpenPackResultDto>.Fail("User not found");
                }

                if (user.Balance < config.Price)
                {
                    return OperationResult<OpenPackResultDto>.Fail("Insufficient balance");
                }

                var candidates = await _cardRepository.GetAvailableCardsByTypesAsync(
                    config.AllowedCardTypes,
                    cancellationToken);

                if (candidates.Count == 0)
                {
                    return OperationResult<OpenPackResultDto>.Fail("No cards available for this pack right now");
                }

                var selected = candidates[Random.Shared.Next(candidates.Count)];

                selected.OwnerId = request.UserId;
                selected.Status = "Owned";
                selected.SellingPrice = null;
                selected.HighestBid = null;
                selected.HighestBidderId = null;

                user.Balance -= config.Price;

                var updatedCard = await _cardRepository.UpdateAsync(selected, cancellationToken);
                await _userRepository.UpdateAsync(user, cancellationToken);

                var transaction = new Transaction
                {
                    BuyerId = request.UserId,
                    SellerId = null,
                    CardId = updatedCard.CardId,
                    Price = config.Price,
                    Date = DateTime.UtcNow
                };
                await _transactionRepository.AddAsync(transaction, cancellationToken);

                var cardDto = new CardDto
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
                    SellingPrice = updatedCard.SellingPrice,
                    OwnerId = updatedCard.OwnerId,
                    Status = updatedCard.Status,
                    CardType = updatedCard.CardType
                };

                var result = new OpenPackResultDto
                {
                    PackType = config.Key,
                    PackPrice = config.Price,
                    BalanceAfterOpen = user.Balance,
                    Card = cardDto
                };

                return OperationResult<OpenPackResultDto>.Ok(result);
            }
            catch (Exception ex)
            {
                return OperationResult<OpenPackResultDto>.Fail(ex.InnerException?.Message ?? ex.Message);
            }
        }

        private static PackConfig? ResolvePackConfig(string input)
        {
            var normalized = (input ?? string.Empty).Trim().ToLowerInvariant();
            return normalized switch
            {
                "starter" => PackConfigs[0],
                "premium" => PackConfigs[1],
                "elite" => PackConfigs[2],
                _ => null
            };
        }
    }
}
