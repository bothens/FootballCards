using Domain_Layer.Entities;

namespace Application_Layer.Common.Interfaces
{
    public interface IMessageRepository
    {
        Task AddAsync(Message message, CancellationToken ct = default);
        Task<List<Message>> GetConversationAsync(int userId, int otherUserId, CancellationToken ct = default);
        Task<List<Message>> GetUserMessagesAsync(int userId, CancellationToken ct = default);
        Task<int> MarkReadAsync(int receiverId, int senderId, CancellationToken ct = default);
        Task<int> DeleteConversationAsync(int userId, int otherUserId, CancellationToken ct = default);
        Task<int> DeleteMessageAsync(int messageId, int userId, CancellationToken ct = default);
    }
}
