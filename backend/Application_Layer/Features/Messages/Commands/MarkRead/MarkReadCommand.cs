using Application_Layer.Common.Models;
using MediatR;

namespace Application_Layer.Features.Messages.Commands.MarkRead
{
    public sealed record MarkReadCommand(int UserId, int FriendId)
        : IRequest<OperationResult<int>>;
}
