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

        public async Task<int> DeleteConversationAsync(int userId, int otherUserId, CancellationToken ct = default)
        {
            var messages = await _db.Messages
                .Where(m =>
                    (m.SenderId == userId && m.ReceiverId == otherUserId) ||
                    (m.SenderId == otherUserId && m.ReceiverId == userId))
                .ToListAsync(ct);

            if (messages.Count == 0)
            {
                return 0;
            }

            _db.Messages.RemoveRange(messages);
            await _db.SaveChangesAsync(ct);
            return messages.Count;
        }

        public async Task<int> DeleteMessageAsync(int messageId, int userId, CancellationToken ct = default)
        {
            var message = await _db.Messages
                .FirstOrDefaultAsync(m => m.MessageId == messageId, ct);

            if (message == null)
            {
                return 0;
            }

            if (message.SenderId != userId && message.ReceiverId != userId)
            {
                return 0;
            }

            _db.Messages.Remove(message);
            await _db.SaveChangesAsync(ct);
            return 1;
        }
    }
}
