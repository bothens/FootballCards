using Domain_Layer.Enums;

namespace Domain_Layer.Entities
{
    public sealed class FriendRequest
    {
        public int FriendRequestId { get; set; }
        public int RequesterId { get; set; }
        public int AddresseeId { get; set; }
        public FriendRequestStatus Status { get; set; } = FriendRequestStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RespondedAt { get; set; }

        public User Requester { get; set; } = null!;
        public User Addressee { get; set; } = null!;
    }
}
