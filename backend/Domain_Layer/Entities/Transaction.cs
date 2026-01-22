namespace Domain_Layer.Entities
{
    public sealed class Transaction
    {
        public int TransactionId { get; set; }
        public int CardId { get; set; }
        public Guid BuyerId { get; set; }
        public Guid SellerId { get; set; }
        public decimal Price { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
