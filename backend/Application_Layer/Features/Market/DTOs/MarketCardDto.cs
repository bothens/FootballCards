namespace Application_Layer.Features.Market.DTOs
{
    public sealed class MarketCardDto
    {
        public int CardId { get; set; }
        public int PlayerId { get; set; }
        public string PlayerName { get; set; } = string.Empty;
        public string PlayerPosition { get; set; } = string.Empty;
        public decimal SellingPrice { get; set; }
        public string Status { get; set; } = "Available";
        public string CardType { get; set; } = "Common";
    }
}
