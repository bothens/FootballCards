using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using MediatR;

namespace Application_Layer.Features.Messages.Commands.DeleteConversation
{
    public sealed class DeleteConversationCommandHandler
        : IRequestHandler<DeleteConversationCommand, OperationResult<int>>
    {
        private readonly IMessageRepository _messages;

        public DeleteConversationCommandHandler(IMessageRepository messages)
        {
            _messages = messages;
        }

        public async Task<OperationResult<int>> Handle(
            DeleteConversationCommand request,
            CancellationToken cancellationToken)
        {
            if (request.UserId == 0)
            {
                return OperationResult<int>.Fail("User not authenticated");
            }

            var deleted = await _messages.DeleteConversationAsync(
                request.UserId,
                request.FriendId,
                cancellationToken);

            return OperationResult<int>.Ok(deleted);
        }
    }
}

