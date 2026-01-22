using Application_Layer.Features.Cards.Commands.Issue;
using Application_Layer.Features.Cards.DTOs;
using Domain_Layer.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
