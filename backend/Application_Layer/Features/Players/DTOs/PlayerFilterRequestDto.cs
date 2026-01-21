namespace Application_Layer.Features.Players.DTOs
{
    public sealed class PlayerFilterRequestDto
    {
        public string? Team { get; init; }
        public string? Position { get; init; }
        public decimal? MinPrice { get; init; }
        public decimal? MaxPrice { get; init; }
    }
}
