using Application_Layer.Common.Models;
using Application_Layer.Features.Trades.DTOs;
using MediatR;

namespace Application_Layer.Features.Trades.Commands.RejectOffer
{
    public sealed record RejectTradeOfferCommand(int UserId, int TradeOfferId)
        : IRequest<OperationResult<TradeOfferDto>>;
}
