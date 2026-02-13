using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Messages.DTOs;
using Domain_Layer.Enums;
using MediatR;
using System.Linq;

namespace Application_Layer.Features.Messages.Queries.GetConversation
{
    public sealed class GetConversationQueryHandler
        : IRequestHandler<GetConversationQuery, OperationResult<List<MessageDto>>>
    {
        private readonly IMessageRepository _messages;
        private readonly IFriendRequestRepository _friendRequests;

        public GetConversationQueryHandler(
            IMessageRepository messages,
            IFriendRequestRepository friendRequests)
        {
            _messages = messages;
            _friendRequests = friendRequests;
        }

        public async Task<OperationResult<List<MessageDto>>> Handle(
            GetConversationQuery request,
            CancellationToken cancellationToken)
        {
            var friendship = await _friendRequests.GetBetweenAsync(
                request.UserId,
                request.FriendId,
                cancellationToken);

            if (friendship == null || friendship.Status != FriendRequestStatus.Accepted)
            {
                return OperationResult<List<MessageDto>>.Fail("Ni är inte vänner");
            }

            var messages = await _messages.GetConversationAsync(request.UserId, request.FriendId, cancellationToken);
            var dtos = messages.Select(m => new MessageDto
            {
                MessageId = m.MessageId,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                Body = m.Body,
                CreatedAt = m.CreatedAt,
                ReadAt = m.ReadAt
            }).ToList();

            return OperationResult<List<MessageDto>>.Ok(dtos);
        }
    }
}
