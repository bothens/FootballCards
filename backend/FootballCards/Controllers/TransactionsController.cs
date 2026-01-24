using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Transactions.Queries.GetMyHistory;
using Application_Layer.Features.Users.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballCards.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUser;

        public TransactionsController(IMediator mediator, ICurrentUserService currentUser)
        {
            _mediator = mediator;
            _currentUser = currentUser;
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetMyTransactions([FromQuery] string? filter, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<UserDto>.Fail("User not authenticated"));


            var result = await _mediator.Send(
                new GetMyTransactionsQuery(userId, filter),
                cancellationToken);

            if (!result.Success) return BadRequest(result.Error);

            return Ok(result.Data);
        }

    }
}
