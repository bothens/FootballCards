namespace Application_Layer.Features.Transactions.DTOs
{
    public sealed class TransactionDto
    {
        public int Id { get; init; }
        public int PlayerId { get; init; }
        public string PlayerName { get; init; } = string.Empty;
        public string Type { get; init; } = string.Empty;
        public int Quantity { get; init; }
        public decimal Price { get; init; }
        public DateTime CreatedAt { get; init; }
    }
}
