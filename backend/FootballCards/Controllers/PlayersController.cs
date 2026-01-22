using Application_Layer.Features.Players.Commands.Create;
using Application_Layer.Features.Players.DTOs;
using Application_Layer.Features.Players.Queries.GetAll;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PlayersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetAllPlayersQuery(), cancellationToken);

            return result.Success
                ? Ok(result.Data)
                : BadRequest(result.Error);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetById([FromRoute] int id)
            => Ok(new { message = $"Get player {id} (TODO)" });

        [HttpGet("filter")]
        public IActionResult Filter([FromQuery] string? position, [FromQuery] string? team)
            => Ok(new { message = "Filter (TODO)", position, team });

        [HttpGet("stats")]
        public IActionResult Stats()
            => Ok(new { message = "Stats (TODO)" });

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePlayerRequestDto request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new CreatePlayerCommand(request), cancellationToken);

            return result.Success
                ? Ok(result.Data)
                : BadRequest(result.Error);
        }
    }
}
