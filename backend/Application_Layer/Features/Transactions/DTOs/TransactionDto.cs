namespace Application_Layer.Features.Transactions.DTOs
{
    public sealed class TransactionDto
    {
        public int TransactionId { get; init; }
        public int CardId { get; init; }
        public int BuyerId { get; init; }
        public int? SellerId { get; init; }
        public decimal Price { get; init; }
        public DateTime Date { get; init; }

        public string PlayerName { get; init; } = string.Empty;
        public string CardType { get; init; } = string.Empty;
    }
}
