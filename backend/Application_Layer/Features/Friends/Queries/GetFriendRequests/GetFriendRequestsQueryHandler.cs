using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Friends.DTOs;
using MediatR;

namespace Application_Layer.Features.Friends.Queries.GetFriendRequests
{
    public sealed class GetFriendRequestsQueryHandler
        : IRequestHandler<GetFriendRequestsQuery, OperationResult<List<FriendRequestDto>>>
    {
        private readonly IFriendRequestRepository _friendRequests;

        public GetFriendRequestsQueryHandler(IFriendRequestRepository friendRequests)
        {
            _friendRequests = friendRequests;
        }

        public async Task<OperationResult<List<FriendRequestDto>>> Handle(
            GetFriendRequestsQuery request,
            CancellationToken cancellationToken)
        {
            var requests = await _friendRequests.GetForUserAsync(request.UserId, cancellationToken);

            var result = requests.Select(fr => new FriendRequestDto
            {
                FriendRequestId = fr.FriendRequestId,
                RequesterId = fr.RequesterId,
                AddresseeId = fr.AddresseeId,
                RequesterName = fr.Requester.DisplayName,
                AddresseeName = fr.Addressee.DisplayName,
                RequesterImageUrl = fr.Requester.ImageUrl,
                AddresseeImageUrl = fr.Addressee.ImageUrl,
                Status = fr.Status.ToString(),
                CreatedAt = fr.CreatedAt
            }).ToList();

            return OperationResult<List<FriendRequestDto>>.Ok(result);
        }
    }
}
