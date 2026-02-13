namespace Application_Layer.Features.Friends.DTOs
{
    public sealed class FriendDto
    {
        public int UserId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }
}
