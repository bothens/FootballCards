namespace Domain_Layer.Entities
{
    public sealed class Transaction
    {
        public int Id { get; set; }

        public Guid UserId { get; set; }
        public int PlayerId { get; set; }

        public string Type { get; set; } = string.Empty;

        public int Quantity { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal Total { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public Player? Player { get; set; }
    }
}
