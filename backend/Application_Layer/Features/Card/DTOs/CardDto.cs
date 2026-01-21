namespace Application_Layer.Features.Cards.DTOs
{
    public sealed class CardDto
    {
        public int CardId { get; set; }
        public int PlayerId { get; set; }
        public string PlayerName { get; set; } = string.Empty;
        public string PlayerPosition { get; set; } = string.Empty;
        public decimal PlayerPrice { get; set; }
        public int? OwnerId { get; set; }
        public string Status { get; set; } = "Available";
        public string CardType { get; set; } = "Common";
    }
}
