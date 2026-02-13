using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Friends.DTOs;
using Domain_Layer.Enums;
using MediatR;

namespace Application_Layer.Features.Friends.Commands.AcceptFriend
{
    public sealed class AcceptFriendCommandHandler
        : IRequestHandler<AcceptFriendCommand, OperationResult<FriendRequestDto>>
    {
        private readonly IFriendRequestRepository _friendRequests;

        public AcceptFriendCommandHandler(IFriendRequestRepository friendRequests)
        {
            _friendRequests = friendRequests;
        }

        public async Task<OperationResult<FriendRequestDto>> Handle(
            AcceptFriendCommand request,
            CancellationToken cancellationToken)
        {
            var friendRequest = await _friendRequests.GetByIdAsync(request.FriendRequestId, cancellationToken);
            if (friendRequest == null)
            {
                return OperationResult<FriendRequestDto>.Fail("Vänförfrågan hittades inte");
            }

            if (friendRequest.AddresseeId != request.UserId)
            {
                return OperationResult<FriendRequestDto>.Fail("Du kan inte acceptera denna förfrågan");
            }

            if (friendRequest.Status != FriendRequestStatus.Pending)
            {
                return OperationResult<FriendRequestDto>.Fail("Vänförfrågan är redan hanterad");
            }

            friendRequest.Status = FriendRequestStatus.Accepted;
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
