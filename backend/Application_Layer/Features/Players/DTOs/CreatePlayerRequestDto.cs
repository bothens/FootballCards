namespace Application_Layer.Features.Players.DTOs
{
    public sealed class CreatePlayerRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
    }
}
