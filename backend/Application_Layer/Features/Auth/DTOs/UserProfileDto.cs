namespace Application_Layer.Features.Auth.DTOs
{
    public sealed class UserProfileDto
    {
        public Guid UserId { get; init; }
        public string Email { get; init; } = string.Empty;
        public string DisplayName { get; init; } = string.Empty;
        public string Token { get; init; } = string.Empty;
    }
}
