using Application_Layer.Common.Models;
using Application_Layer.Features.Trade.DTOs;
using MediatR;

namespace Application_Layer.Features.Trade.Commands.Bulk
{
    public sealed record BulkTradeCommand(BulkTradeRequestDto Request)
        : IRequest<OperationResult<TradeResultDto>>;
}
