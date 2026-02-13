using Domain_Layer.Enums;

namespace Application_Layer.Features.Friends.DTOs
{
    public sealed class FriendRequestDto
    {
        public int FriendRequestId { get; set; }
        public int RequesterId { get; set; }
        public int AddresseeId { get; set; }
        public string RequesterName { get; set; } = string.Empty;
        public string AddresseeName { get; set; } = string.Empty;
        public string? RequesterImageUrl { get; set; }
        public string? AddresseeImageUrl { get; set; }
        public string Status { get; set; } = FriendRequestStatus.Pending.ToString();
        public DateTime CreatedAt { get; set; }
    }
}
