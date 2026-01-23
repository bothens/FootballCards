using Application_Layer.Features.Transactions.Queries.GetMyHistory;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace FootballCards.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TransactionsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetMyTransactions([FromQuery] string? filter, CancellationToken cancellationToken)
        {
            //var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //if (string.IsNullOrWhiteSpace(userIdClaim))
            //{
            //    return Unauthorized("User id missing in token");
            //}

            //if (!int.TryParse(userIdClaim, out var userId))
            //{
            //    return Unauthorized("Invalid user id in token");
            //}
            // Hårdkodat UserId för test; TODO: hämta från JWT
            int userId = 9;

            var result = await _mediator.Send(
                new GetMyTransactionsQuery(userId, filter),
                cancellationToken);

            if (!result.Success) return BadRequest(result.Error);

            return Ok(result.Data);
        }

    }
}
