using Application_Layer.Common.Models;
using Application_Layer.Features.Friends.DTOs;
using MediatR;

namespace Application_Layer.Features.Friends.Commands.AcceptFriend
{
    public sealed record AcceptFriendCommand(int UserId, int FriendRequestId)
        : IRequest<OperationResult<FriendRequestDto>>;
}
