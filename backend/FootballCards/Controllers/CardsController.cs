using Application_Layer.Features.Cards.Commands.Issue;
using Application_Layer.Features.Cards.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class CardsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CardsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("issue")]
        public async Task<IActionResult> IssueCard(
             [FromBody] CreateCardDto card,
             CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(
                new IssueCardCommand(card),
                cancellationToken);

            return result.Success
                ? Ok(result.Data)
                : BadRequest(result.Error);
        }
    }
}
