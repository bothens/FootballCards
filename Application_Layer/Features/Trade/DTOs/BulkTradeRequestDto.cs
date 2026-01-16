namespace Application_Layer.Features.Trade.DTOs
{
    public sealed class BulkTradeRequestDto
    {
        public IReadOnlyList<TradeRequestDto> Trades { get; init; } = [];
    }
}
