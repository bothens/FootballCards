using Application_Layer.Common.Models;
using MediatR;

namespace Application_Layer.Features.Messages.Commands.DeleteMessage
{
    public sealed record DeleteMessageCommand(int UserId, int MessageId)
        : IRequest<OperationResult<int>>;
}

