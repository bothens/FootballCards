using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Market.DTOs;
using MediatR;

namespace Application_Layer.Features.Market.Commands.Bid
{
    public sealed class BidCardCommandHandler
        : IRequestHandler<BidCardCommand, OperationResult<BidResultDto>>
    {
        private readonly ICardRepository _cardRepository;

        public BidCardCommandHandler(ICardRepository cardRepository)
        {
            _cardRepository = cardRepository;
        }

        public async Task<OperationResult<BidResultDto>> Handle(
            BidCardCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                if (request.BidAmount <= 0)
                {
                    return OperationResult<BidResultDto>.Fail("Budet måste vara större än 0");
                }

                var card = await _cardRepository.GetByIdAsync(request.CardId, cancellationToken);
                if (card == null)
                {
                    return OperationResult<BidResultDto>.Fail("Kort inte funnet");
                }

                if (card.Status != "Available")
                {
                    return OperationResult<BidResultDto>.Fail("Kort är inte tillgängligt för bud");
                }

                if (card.OwnerId.HasValue && card.OwnerId.Value == request.BidderId)
                {
                    return OperationResult<BidResultDto>.Fail("Du kan inte buda på ditt egna kort");
                }

                var currentHighest = card.HighestBid ?? 0m;
                if (request.BidAmount <= currentHighest)
                {
                    return OperationResult<BidResultDto>.Fail("Budet måste vara högre än nuvarande bud");
                }

                card.HighestBid = request.BidAmount;
                card.HighestBidderId = request.BidderId;

                await _cardRepository.UpdateAsync(card, cancellationToken);

                return OperationResult<BidResultDto>.Ok(new BidResultDto
                {
                    CardId = card.CardId,
                    HighestBid = card.HighestBid ?? request.BidAmount
                });
            }
            catch (Exception ex)
            {
                return OperationResult<BidResultDto>.Fail(
                    ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
