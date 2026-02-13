using Application_Layer.Common.Models;
using Application_Layer.Features.Friends.DTOs;
using MediatR;

namespace Application_Layer.Features.Friends.Commands.RejectFriend
{
    public sealed record RejectFriendCommand(int UserId, int FriendRequestId)
        : IRequest<OperationResult<FriendRequestDto>>;
}
