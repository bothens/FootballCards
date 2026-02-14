using Application_Layer.Common.Models;
using MediatR;

namespace Application_Layer.Features.Messages.Commands.DeleteConversation
{
    public sealed record DeleteConversationCommand(int UserId, int FriendId)
        : IRequest<OperationResult<int>>;
}

