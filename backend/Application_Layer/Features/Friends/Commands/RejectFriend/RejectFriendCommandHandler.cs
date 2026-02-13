using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Friends.DTOs;
using Domain_Layer.Enums;
using MediatR;

namespace Application_Layer.Features.Friends.Commands.RejectFriend
{
    public sealed class RejectFriendCommandHandler
        : IRequestHandler<RejectFriendCommand, OperationResult<FriendRequestDto>>
    {
        private readonly IFriendRequestRepository _friendRequests;

        public RejectFriendCommandHandler(IFriendRequestRepository friendRequests)
        {
            _friendRequests = friendRequests;
        }

        public async Task<OperationResult<FriendRequestDto>> Handle(
            RejectFriendCommand request,
            CancellationToken cancellationToken)
        {
            var friendRequest = await _friendRequests.GetByIdAsync(request.FriendRequestId, cancellationToken);
            if (friendRequest == null)
            {
                return OperationResult<FriendRequestDto>.Fail("Vänförfrågan hittades inte");
            }

            if (friendRequest.AddresseeId != request.UserId)
            {
                return OperationResult<FriendRequestDto>.Fail("Du kan inte avslå denna förfrågan");
            }

            if (friendRequest.Status != FriendRequestStatus.Pending)
            {
                return OperationResult<FriendRequestDto>.Fail("Vänförfrågan är redan hanterad");
            }

            friendRequest.Status = FriendRequestStatus.Rejected;
            friendRequest.RespondedAt = DateTime.UtcNow;

            var updated = await _friendRequests.UpdateAsync(friendRequest, cancellationToken);

            var dto = new FriendRequestDto
            {
                FriendRequestId = updated.FriendRequestId,
                RequesterId = updated.RequesterId,
                AddresseeId = updated.AddresseeId,
                RequesterName = updated.Requester.DisplayName,
                AddresseeName = updated.Addressee.DisplayName,
                RequesterImageUrl = updated.Requester.ImageUrl,
                AddresseeImageUrl = updated.Addressee.ImageUrl,
                Status = updated.Status.ToString(),
                CreatedAt = updated.CreatedAt
            };

            return OperationResult<FriendRequestDto>.Ok(dto);
        }
    }
}
