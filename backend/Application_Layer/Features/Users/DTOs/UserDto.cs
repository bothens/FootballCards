namespace Application_Layer.Features.Users.DTOs
{
    public sealed class UserDto
    {
        public int UserId { get; init; }
        public string Email { get; init; } = string.Empty;
        public string DisplayName { get; init; } = string.Empty;
        public DateTime CreatedAt { get; init; }
    }
}
