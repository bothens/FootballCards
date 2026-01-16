namespace Application_Layer.Features.Trade.DTOs
{
    public sealed class TradeRequestDto
    {
        public int PlayerId { get; init; }
        public int Quantity { get; init; }
        public decimal Price { get; init; }
    }
}
