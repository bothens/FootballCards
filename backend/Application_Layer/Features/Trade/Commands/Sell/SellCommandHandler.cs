using Application_Layer.Common.Models;
using Application_Layer.Features.Trade.DTOs;
using MediatR;

namespace Application_Layer.Features.Trade.Commands.Sell
{
    public sealed class SellCommandHandler
        : IRequestHandler<SellCommand, OperationResult<TradeResultDto>>
    {
        public Task<OperationResult<TradeResultDto>> Handle(
            SellCommand request,
            CancellationToken cancellationToken)
        {
            var result = new TradeResultDto
            {
                Success = true,
                Message = "Sell executed"
            };

            return Task.FromResult(OperationResult<TradeResultDto>.Ok(result));
        }
    }
}
