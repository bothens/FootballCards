using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Messages.Commands.MarkRead;
using Application_Layer.Features.Messages.Commands.SendMessage;
using Application_Layer.Features.Messages.DTOs;
using Application_Layer.Features.Messages.Queries.GetConversation;
using Application_Layer.Features.Messages.Queries.GetThreads;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public sealed class MessagesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUser;

        public MessagesController(IMediator mediator, ICurrentUserService currentUser)
        {
            _mediator = mediator;
            _currentUser = currentUser;
        }

        [HttpGet("threads")]
        public async Task<IActionResult> GetThreads(CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<List<MessageThreadDto>>.Fail("User not authenticated"));

            var result = await _mediator.Send(new GetThreadsQuery(userId), cancellationToken);
            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }

        [HttpGet("with/{friendId:int}")]
        public async Task<IActionResult> GetConversation(
            [FromRoute] int friendId,
            CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<List<MessageDto>>.Fail("User not authenticated"));

            var result = await _mediator.Send(new GetConversationQuery(userId, friendId), cancellationToken);
            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }

        [HttpPost]
        public async Task<IActionResult> Send(
            [FromBody] SendMessageRequestDto request,
            CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<MessageDto>.Fail("User not authenticated"));

            var result = await _mediator.Send(
                new SendMessageCommand(userId, request.ToUserId, request.Body),
                cancellationToken);

            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }

        [HttpPost("read/{friendId:int}")]
        public async Task<IActionResult> MarkRead(
            [FromRoute] int friendId,
            CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<int>.Fail("User not authenticated"));

            var result = await _mediator.Send(new MarkReadCommand(userId, friendId), cancellationToken);
            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }
    }
}
