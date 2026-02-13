namespace Application_Layer.Features.Users.DTOs
{
    public sealed class UpdateProfileRequestDto
    {
        public string? DisplayName { get; set; }
        public string? ImageUrl { get; set; }
    }
}
