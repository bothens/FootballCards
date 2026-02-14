using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using MediatR;

namespace Application_Layer.Features.Messages.Commands.DeleteMessage
{
    public sealed class DeleteMessageCommandHandler
        : IRequestHandler<DeleteMessageCommand, OperationResult<int>>
    {
        private readonly IMessageRepository _messages;

        public DeleteMessageCommandHandler(IMessageRepository messages)
        {
            _messages = messages;
        }

        public async Task<OperationResult<int>> Handle(
            DeleteMessageCommand request,
            CancellationToken cancellationToken)
        {
            if (request.UserId == 0)
            {
                return OperationResult<int>.Fail("User not authenticated");
            }

            var deleted = await _messages.DeleteMessageAsync(
                request.MessageId,
                request.UserId,
                cancellationToken);

            return deleted > 0
                ? OperationResult<int>.Ok(deleted)
                : OperationResult<int>.Fail("Message not found");
        }
    }
}

