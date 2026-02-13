using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Friends.Commands.AcceptFriend;
using Application_Layer.Features.Friends.Commands.RejectFriend;
using Application_Layer.Features.Friends.Commands.RequestFriend;
using Application_Layer.Features.Friends.DTOs;
using Application_Layer.Features.Friends.Queries.GetFriendRequests;
using Application_Layer.Features.Friends.Queries.GetFriends;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public sealed class FriendsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUser;

        public FriendsController(IMediator mediator, ICurrentUserService currentUser)
        {
            _mediator = mediator;
            _currentUser = currentUser;
        }

        [HttpGet]
        public async Task<IActionResult> GetFriends(CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<List<FriendDto>>.Fail("User not authenticated"));

            var result = await _mediator.Send(new GetFriendsQuery(userId), cancellationToken);
            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }

        [HttpGet("requests")]
        public async Task<IActionResult> GetRequests(CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<List<FriendRequestDto>>.Fail("User not authenticated"));

            var result = await _mediator.Send(new GetFriendRequestsQuery(userId), cancellationToken);
            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }

        [HttpPost("request")]
        public async Task<IActionResult> RequestFriend(
            [FromBody] FriendRequestCreateDto request,
            CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<FriendRequestDto>.Fail("User not authenticated"));

            var result = await _mediator.Send(
                new RequestFriendCommand(userId, request.TargetUserId),
                cancellationToken);

            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }

        [HttpPost("accept")]
        public async Task<IActionResult> Accept(
            [FromBody] FriendRequestActionDto request,
            CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<FriendRequestDto>.Fail("User not authenticated"));

            var result = await _mediator.Send(
                new AcceptFriendCommand(userId, request.FriendRequestId),
                cancellationToken);

            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }

        [HttpPost("reject")]
        public async Task<IActionResult> Reject(
            [FromBody] FriendRequestActionDto request,
            CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<FriendRequestDto>.Fail("User not authenticated"));

            var result = await _mediator.Send(
                new RejectFriendCommand(userId, request.FriendRequestId),
                cancellationToken);

            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }
    }
}
