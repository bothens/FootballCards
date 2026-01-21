namespace Application_Layer.Features.Players.DTOs
{
    public sealed class PlayerStatsResponseDto
    {
        public int TotalPlayers { get; init; }
        public decimal AveragePrice { get; init; }
        public decimal HighestPrice { get; init; }
        public decimal LowestPrice { get; init; }
    }
}
