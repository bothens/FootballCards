using Application_Layer.Common.Models;
using Application_Layer.Features.Market.DTOs;
using MediatR;

namespace Application_Layer.Features.Market.Commands.Bid
{
    public sealed record BidCardCommand(int BidderId, int CardId, decimal BidAmount)
        : IRequest<OperationResult<BidResultDto>>;
}
