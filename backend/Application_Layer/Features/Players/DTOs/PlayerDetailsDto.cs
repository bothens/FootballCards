namespace Application_Layer.Features.Players.DTOs
{
    public sealed class PlayerDetailsDto
    {
        public int Id { get; init; }
        public string Name { get; init; } = string.Empty;
        public string Team { get; init; } = string.Empty;
        public string Position { get; init; } = string.Empty;
        public decimal CurrentPrice { get; init; }
        public decimal PriceChange24h { get; init; }
    }
}
