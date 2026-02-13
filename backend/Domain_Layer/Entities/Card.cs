using System.ComponentModel.DataAnnotations.Schema;

namespace Domain_Layer.Entities
{
    public sealed class Card
    {
        public int CardId { get; set; }
        public int PlayerId { get; set; }
        public int? OwnerId { get; set; }
        public string Status { get; set; } = "Selling";
        public string CardType { get; set; } = "Common"; 
        public decimal Price { get; set; }
        public decimal? SellingPrice { get; set; }
        public decimal? HighestBid { get; set; }
        public int? HighestBidderId { get; set; }
        public string? ImageUrl { get; set; }

        [NotMapped]
        public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Player Player { get; set; } = null!;
    }
}
