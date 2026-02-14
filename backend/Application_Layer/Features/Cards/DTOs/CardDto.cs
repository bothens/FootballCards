namespace Application_Layer.Features.Cards.DTOs
{
    public sealed class CardDto
    {
        public int CardId { get; set; }
        public int PlayerId { get; set; }
        public string PlayerName { get; set; } = string.Empty;
        public string PlayerTeam { get; set; } = string.Empty;
        public string PlayerPosition { get; set; } = string.Empty;
        public string PlayerImageUrl { get; set; } = string.Empty;
        public string CardImageUrl { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal? SellingPrice { get; set; }
        public int? OwnerId { get; set; }
        public string Status { get; set; } = "Available";
        public string CardType { get; set; } = "Common";
    }
}
