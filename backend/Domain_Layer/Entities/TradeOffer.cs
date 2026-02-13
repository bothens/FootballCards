using Domain_Layer.Enums;

namespace Domain_Layer.Entities
{
    public sealed class TradeOffer
    {
        public int TradeOfferId { get; set; }
        public int FromUserId { get; set; }
        public int ToUserId { get; set; }
        public int CardId { get; set; }
        public decimal? Price { get; set; }
        public TradeOfferStatus Status { get; set; } = TradeOfferStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RespondedAt { get; set; }

        public User FromUser { get; set; } = null!;
        public User ToUser { get; set; } = null!;
        public Card Card { get; set; } = null!;
    }
}
