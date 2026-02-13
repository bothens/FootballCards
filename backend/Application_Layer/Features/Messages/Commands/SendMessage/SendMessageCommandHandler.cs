using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Messages.DTOs;
using Domain_Layer.Entities;
using Domain_Layer.Enums;
using MediatR;

namespace Application_Layer.Features.Messages.Commands.SendMessage
{
    public sealed class SendMessageCommandHandler
        : IRequestHandler<SendMessageCommand, OperationResult<MessageDto>>
    {
        private readonly IMessageRepository _messages;
        private readonly IFriendRequestRepository _friendRequests;

        public SendMessageCommandHandler(
            IMessageRepository messages,
            IFriendRequestRepository friendRequests)
        {
            _messages = messages;
            _friendRequests = friendRequests;
        }

        public async Task<OperationResult<MessageDto>> Handle(
            SendMessageCommand request,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Body))
            {
                return OperationResult<MessageDto>.Fail("Meddelandet är tomt");
            }

            var friendship = await _friendRequests.GetBetweenAsync(
                request.SenderId,
                request.ReceiverId,
                cancellationToken);

            if (friendship == null || friendship.Status != FriendRequestStatus.Accepted)
            {
                return OperationResult<MessageDto>.Fail("Ni är inte vänner");
            }

            var message = new Message
            {
                SenderId = request.SenderId,
                ReceiverId = request.ReceiverId,
                Body = request.Body.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            await _messages.AddAsync(message, cancellationToken);

            return OperationResult<MessageDto>.Ok(new MessageDto
            {
                MessageId = message.MessageId,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                Body = message.Body,
                CreatedAt = message.CreatedAt,
                ReadAt = message.ReadAt
            });
        }
    }
}
