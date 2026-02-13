using Domain_Layer.Entities;

namespace Application_Layer.Common.Interfaces
{
    public interface IFriendRequestRepository
    {
        Task<FriendRequest?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<FriendRequest?> GetBetweenAsync(int userId, int otherUserId, CancellationToken ct = default);
        Task<List<FriendRequest>> GetForUserAsync(int userId, CancellationToken ct = default);
        Task AddAsync(FriendRequest request, CancellationToken ct = default);
        Task<FriendRequest> UpdateAsync(FriendRequest request, CancellationToken ct = default);
    }
}
