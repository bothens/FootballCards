using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Messages.Commands.MarkRead;
using Domain_Layer.Enums;
using MediatR;

namespace Application_Layer.Features.Messages.Commands.MarkRead
{
    public sealed class MarkReadCommandHandler
        : IRequestHandler<MarkReadCommand, OperationResult<int>>
    {
        private readonly IMessageRepository _messages;
        private readonly IFriendRequestRepository _friendRequests;

        public MarkReadCommandHandler(
            IMessageRepository messages,
            IFriendRequestRepository friendRequests)
        {
            _messages = messages;
            _friendRequests = friendRequests;
        }

        public async Task<OperationResult<int>> Handle(
            MarkReadCommand request,
            CancellationToken cancellationToken)
        {
            var friendship = await _friendRequests.GetBetweenAsync(
                request.UserId,
                request.FriendId,
                cancellationToken);

            if (friendship == null || friendship.Status != FriendRequestStatus.Accepted)
            {
                return OperationResult<int>.Fail("Ni är inte vänner");
            }

            var count = await _messages.MarkReadAsync(request.UserId, request.FriendId, cancellationToken);
            return OperationResult<int>.Ok(count);
        }
    }
}
