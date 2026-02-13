using Application_Layer.Common.Models;
using Application_Layer.Features.Friends.DTOs;
using MediatR;

namespace Application_Layer.Features.Friends.Commands.RequestFriend
{
    public sealed record RequestFriendCommand(int RequesterId, int TargetUserId)
        : IRequest<OperationResult<FriendRequestDto>>;
}
