using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Friends.DTOs;
using Domain_Layer.Entities;
using Domain_Layer.Enums;
using MediatR;

namespace Application_Layer.Features.Friends.Commands.RequestFriend
{
    public sealed class RequestFriendCommandHandler
        : IRequestHandler<RequestFriendCommand, OperationResult<FriendRequestDto>>
    {
        private readonly IFriendRequestRepository _friendRequests;
        private readonly IUserRepository _users;

        public RequestFriendCommandHandler(
            IFriendRequestRepository friendRequests,
            IUserRepository users)
        {
            _friendRequests = friendRequests;
            _users = users;
        }

        public async Task<OperationResult<FriendRequestDto>> Handle(
            RequestFriendCommand request,
            CancellationToken cancellationToken)
        {
            if (request.RequesterId == request.TargetUserId)
            {
                return OperationResult<FriendRequestDto>.Fail("Du kan inte lägga till dig själv");
            }

            var target = await _users.GetByIdAsync(request.TargetUserId, cancellationToken);
            if (target == null)
            {
                return OperationResult<FriendRequestDto>.Fail("User not found");
            }

            var existing = await _friendRequests.GetBetweenAsync(
                request.RequesterId,
                request.TargetUserId,
                cancellationToken);

            if (existing != null)
            {
                if (existing.Status == FriendRequestStatus.Pending)
                {
                    return OperationResult<FriendRequestDto>.Fail("Vänförfrågan finns redan");
                }
                if (existing.Status == FriendRequestStatus.Accepted)
                {
                    return OperationResult<FriendRequestDto>.Fail("Ni är redan vänner");
                }
                if (existing.Status == FriendRequestStatus.Rejected)
                {
                    return OperationResult<FriendRequestDto>.Fail("Vänförfrågan avvisades tidigare");
                }
            }

            var requestEntity = new FriendRequest
            {
                RequesterId = request.RequesterId,
                AddresseeId = request.TargetUserId,
                Status = FriendRequestStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _friendRequests.AddAsync(requestEntity, cancellationToken);

            var requester = await _users.GetByIdAsync(request.RequesterId, cancellationToken);

            var dto = new FriendRequestDto
            {
                FriendRequestId = requestEntity.FriendRequestId,
                RequesterId = requestEntity.RequesterId,
                AddresseeId = requestEntity.AddresseeId,
                RequesterName = requester?.DisplayName ?? string.Empty,
                AddresseeName = target.DisplayName,
                RequesterImageUrl = requester?.ImageUrl,
                AddresseeImageUrl = target.ImageUrl,
                Status = requestEntity.Status.ToString(),
                CreatedAt = requestEntity.CreatedAt
            };

            return OperationResult<FriendRequestDto>.Ok(dto);
        }
    }
}
