using Application_Layer.Common.Interfaces;
using Domain_Layer.Entities;
using Infrastructure_Layer.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer.Repositories.Implementations
{
    public sealed class FriendRequestRepository : IFriendRequestRepository
    {
        private readonly AppDbContext _db;

        public FriendRequestRepository(AppDbContext db)
        {
            _db = db;
        }

        public Task<FriendRequest?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            return _db.FriendRequests
                .Include(fr => fr.Requester)
                .Include(fr => fr.Addressee)
                .FirstOrDefaultAsync(fr => fr.FriendRequestId == id, ct);
        }

        public Task<FriendRequest?> GetBetweenAsync(int userId, int otherUserId, CancellationToken ct = default)
        {
            return _db.FriendRequests.FirstOrDefaultAsync(fr =>
                (fr.RequesterId == userId && fr.AddresseeId == otherUserId) ||
                (fr.RequesterId == otherUserId && fr.AddresseeId == userId), ct);
        }

        public Task<List<FriendRequest>> GetForUserAsync(int userId, CancellationToken ct = default)
        {
            return _db.FriendRequests
                .Include(fr => fr.Requester)
                .Include(fr => fr.Addressee)
                .Where(fr => fr.RequesterId == userId || fr.AddresseeId == userId)
                .OrderByDescending(fr => fr.CreatedAt)
                .ToListAsync(ct);
        }

        public async Task AddAsync(FriendRequest request, CancellationToken ct = default)
        {
            await _db.FriendRequests.AddAsync(request, ct);
            await _db.SaveChangesAsync(ct);
        }

        public async Task<FriendRequest> UpdateAsync(FriendRequest request, CancellationToken ct = default)
        {
            _db.FriendRequests.Update(request);
            await _db.SaveChangesAsync(ct);
            return request;
        }
    }
}
