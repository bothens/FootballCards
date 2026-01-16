using Application_Layer.Common.Models;
using Application_Layer.Features.Trade.DTOs;
using MediatR;

namespace Application_Layer.Features.Trade.Commands.Sell
{
    public sealed record SellCommand(TradeRequestDto Request)
        : IRequest<OperationResult<TradeResultDto>>;
}
