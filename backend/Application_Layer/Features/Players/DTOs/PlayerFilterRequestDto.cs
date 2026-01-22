namespace Application_Layer.Features.Players.DTOs
{
    public sealed class PlayerFilterRequestDto
    {
        public string? Team { get; init; }
        public string? Position { get; init; }
    }
}
