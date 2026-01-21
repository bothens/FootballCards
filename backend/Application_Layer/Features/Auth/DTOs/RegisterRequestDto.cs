namespace Application_Layer.Features.Auth.DTOs
{
    public sealed class RegisterRequestDto
    {
        public string Email { get; init; } = string.Empty;
        public string Password { get; init; } = string.Empty;
        public string DisplayName { get; init; } = string.Empty;
    }
}
