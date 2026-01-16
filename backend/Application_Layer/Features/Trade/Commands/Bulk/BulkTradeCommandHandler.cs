using Application_Layer.Common.Models;
using Application_Layer.Features.Trade.DTOs;
using MediatR;

namespace Application_Layer.Features.Trade.Commands.Bulk
{
    public sealed class BulkTradeCommandHandler
        : IRequestHandler<BulkTradeCommand, OperationResult<TradeResultDto>>
    {
        public Task<OperationResult<TradeResultDto>> Handle(
            BulkTradeCommand request,
            CancellationToken cancellationToken)
        {
            var result = new TradeResultDto
            {
                Success = true,
                Message = "Bulk trade executed"
            };

            return Task.FromResult(OperationResult<TradeResultDto>.Ok(result));
        }
    }
}
