using Application_Layer.Common.Models;
using Application_Layer.Features.Friends.DTOs;
using MediatR;

namespace Application_Layer.Features.Friends.Queries.GetFriendRequests
{
    public sealed record GetFriendRequestsQuery(int UserId)
        : IRequest<OperationResult<List<FriendRequestDto>>>;
}
