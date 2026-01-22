namespace Domain_Layer.Entities
{
    public sealed class Transaction
    {
        public int TransactionId { get; set; }
        public int CardId { get; set; }
        public int BuyerId { get; set; }
        public int? SellerId { get; set; }
        public decimal Price { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
