using Application_Layer.Common.Models;
using Application_Layer.Features.Trades.DTOs;
using MediatR;

namespace Application_Layer.Features.Trades.Commands.CreateOffer
{
    public sealed record CreateTradeOfferCommand(int FromUserId, int ToUserId, int CardId, decimal? Price)
        : IRequest<OperationResult<TradeOfferDto>>;
}
