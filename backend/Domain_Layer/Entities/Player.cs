using System.ComponentModel.DataAnnotations.Schema;

namespace Domain_Layer.Entities
{
    public sealed class Player
    {
        [Column("PlayerId")]
        public int Id { get; set; }
        [Column("Name")]
        public string Name { get; set; } = string.Empty;
        [NotMapped]
        public string Team { get; set; } = string.Empty;
        [Column("Position")]
        public string Position { get; set; } = string.Empty;
        [NotMapped]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        //public ICollection<PriceHistory> PriceHistory { get; set; } = new List<PriceHistory>();
    }
}
