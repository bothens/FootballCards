namespace Application_Layer.Features.Messages.DTOs
{
    public sealed class MessageThreadDto
    {
        public int FriendId { get; set; }
        public string FriendName { get; set; } = string.Empty;
        public string? FriendImageUrl { get; set; }
        public string LastMessage { get; set; } = string.Empty;
        public DateTime LastMessageAt { get; set; }
        public int UnreadCount { get; set; }
    }
}
