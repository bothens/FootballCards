using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Friends.DTOs;
using Domain_Layer.Enums;
using MediatR;
using System.Linq;

namespace Application_Layer.Features.Friends.Queries.GetFriends
{
    public sealed class GetFriendsQueryHandler
        : IRequestHandler<GetFriendsQuery, OperationResult<List<FriendDto>>>
    {
        private readonly IFriendRequestRepository _friendRequests;

        public GetFriendsQueryHandler(IFriendRequestRepository friendRequests)
        {
            _friendRequests = friendRequests;
        }

        public async Task<OperationResult<List<FriendDto>>> Handle(
            GetFriendsQuery request,
            CancellationToken cancellationToken)
        {
            var requests = await _friendRequests.GetForUserAsync(request.UserId, cancellationToken);

            var friends = requests
                .Where(fr => fr.Status == FriendRequestStatus.Accepted)
                .Select(fr =>
                {
                    var friend = fr.RequesterId == request.UserId ? fr.Addressee : fr.Requester;
                    return new FriendDto
                    {
                        UserId = friend.UserId,
                        DisplayName = friend.DisplayName,
                        Email = friend.Email,
                        ImageUrl = friend.ImageUrl
                    };
                })
                .DistinctBy(f => f.UserId)
                .ToList();

            return OperationResult<List<FriendDto>>.Ok(friends);
        }
    }
}
