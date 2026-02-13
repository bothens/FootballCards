using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Messages.DTOs;
using MediatR;
using System.Collections.Generic;
using System.Linq;

namespace Application_Layer.Features.Messages.Queries.GetThreads
{
    public sealed class GetThreadsQueryHandler
        : IRequestHandler<GetThreadsQuery, OperationResult<List<MessageThreadDto>>>
    {
        private readonly IMessageRepository _messages;
        private readonly IUserRepository _users;

        public GetThreadsQueryHandler(IMessageRepository messages, IUserRepository users)
        {
            _messages = messages;
            _users = users;
        }

        public async Task<OperationResult<List<MessageThreadDto>>> Handle(
            GetThreadsQuery request,
            CancellationToken cancellationToken)
        {
            var messages = await _messages.GetUserMessagesAsync(request.UserId, cancellationToken);

            var grouped = messages
                .GroupBy(m => m.SenderId == request.UserId ? m.ReceiverId : m.SenderId)
                .ToList();

            var friendIds = grouped.Select(g => g.Key).Distinct().ToList();
            var friends = new Dictionary<int, Domain_Layer.Entities.User>();
            foreach (var friendId in friendIds)
            {
                var user = await _users.GetByIdAsync(friendId, cancellationToken);
                if (user != null)
                {
                    friends[friendId] = user;
                }
            }

            var threads = grouped.Select(g =>
            {
                var latest = g.OrderByDescending(m => m.CreatedAt).First();
                var unread = g.Count(m => m.ReceiverId == request.UserId && m.ReadAt == null);
                friends.TryGetValue(g.Key, out var friend);
                return new MessageThreadDto
                {
                    FriendId = g.Key,
                    FriendName = friend?.DisplayName ?? "Unknown",
                    FriendImageUrl = friend?.ImageUrl,
                    LastMessage = latest.Body,
                    LastMessageAt = latest.CreatedAt,
                    UnreadCount = unread
                };
            })
            .OrderByDescending(t => t.LastMessageAt)
            .ToList();

            return OperationResult<List<MessageThreadDto>>.Ok(threads);
        }
    }
}
