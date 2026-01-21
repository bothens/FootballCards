using Application_Layer.Features.Trade.DTOs;

namespace Application_Layer.Services
{
    public sealed class TradeService
    {
        public TradeResultDto Buy(TradeRequestDto request)
            => new() { Success = true };

        public TradeResultDto Sell(TradeRequestDto request)
            => new() { Success = true };

        public TradeResultDto Bulk(BulkTradeRequestDto request)
            => new() { Success = true };
    }
}
