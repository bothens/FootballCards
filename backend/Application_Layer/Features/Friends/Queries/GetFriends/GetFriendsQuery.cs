using Application_Layer.Common.Models;
using Application_Layer.Features.Friends.DTOs;
using MediatR;

namespace Application_Layer.Features.Friends.Queries.GetFriends
{
    public sealed record GetFriendsQuery(int UserId)
        : IRequest<OperationResult<List<FriendDto>>>;
}
