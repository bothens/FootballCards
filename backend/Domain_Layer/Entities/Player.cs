namespace Domain_Layer.Entities
{
    public sealed class Player
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Team { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;

        public decimal CurrentPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        public ICollection<PriceHistory> PriceHistory { get; set; } = new List<PriceHistory>();
    }
}
