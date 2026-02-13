using Application_Layer.Common.Interfaces;
using Domain_Layer.Entities;
using Infrastructure_Layer.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer.Repositories.Implementations
{
    public sealed class MessageRepository : IMessageRepository
    {
        private readonly AppDbContext _db;

        public MessageRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Message message, CancellationToken ct = default)
        {
            await _db.Messages.AddAsync(message, ct);
            await _db.SaveChangesAsync(ct);
        }

        public Task<List<Message>> GetConversationAsync(int userId, int otherUserId, CancellationToken ct = default)
        {
            return _db.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m =>
                    (m.SenderId == userId && m.ReceiverId == otherUserId) ||
                    (m.SenderId == otherUserId && m.ReceiverId == userId))
                .OrderBy(m => m.CreatedAt)
                .ToListAsync(ct);
        }

        public Task<List<Message>> GetUserMessagesAsync(int userId, CancellationToken ct = default)
        {
            return _db.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync(ct);
        }

        public async Task<int> MarkReadAsync(int receiverId, int senderId, CancellationToken ct = default)
        {
            var messages = await _db.Messages
                .Where(m => m.ReceiverId == receiverId && m.SenderId == senderId && m.ReadAt == null)
                .ToListAsync(ct);

            var now = DateTime.UtcNow;
            foreach (var msg in messages)
            {
                msg.ReadAt = now;
            }

            await _db.SaveChangesAsync(ct);
            return messages.Count;
        }
    }
}
