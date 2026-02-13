namespace Application_Layer.Features.Users.DTOs
{
    public sealed class UserProfileDto
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string UserRole { get; set; } = "user";
        public decimal Balance { get; set; }
        public string? ImageUrl { get; set; }
    }
}
