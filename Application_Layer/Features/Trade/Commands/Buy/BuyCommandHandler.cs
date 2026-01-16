using Application_Layer.Common.Models;
using Application_Layer.Features.Trade.DTOs;
using MediatR;

namespace Application_Layer.Features.Trade.Commands.Buy
{
    public sealed class BuyCommandHandler
        : IRequestHandler<BuyCommand, OperationResult<TradeResultDto>>
    {
        public Task<OperationResult<TradeResultDto>> Handle(
            BuyCommand request,
            CancellationToken cancellationToken)
        {
            var result = new TradeResultDto
            {
                Success = true,
                Message = "Buy executed"
            };

            return Task.FromResult(OperationResult<TradeResultDto>.Ok(result));
        }
    }
}
