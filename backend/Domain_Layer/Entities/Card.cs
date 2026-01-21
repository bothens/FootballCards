using System;
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
        [NotMapped]
        public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Player Player { get; set; } = null!;
    }
}
