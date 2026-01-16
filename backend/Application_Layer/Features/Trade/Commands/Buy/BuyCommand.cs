using Application_Layer.Common.Models;
using Application_Layer.Features.Trade.DTOs;
using MediatR;

namespace Application_Layer.Features.Trade.Commands.Buy
{
    public sealed record BuyCommand(TradeRequestDto Request)
        : IRequest<OperationResult<TradeResultDto>>;
}
