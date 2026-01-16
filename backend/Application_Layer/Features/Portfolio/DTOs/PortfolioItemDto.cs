namespace Application_Layer.Features.Portfolio.DTOs
{
    public sealed class PortfolioItemDto
    {
        public int PlayerId { get; init; }
        public string PlayerName { get; init; } = string.Empty;
        public int Quantity { get; init; }
        public decimal AvgBuyPrice { get; init; }
        public decimal CurrentPrice { get; init; }
    }
}
