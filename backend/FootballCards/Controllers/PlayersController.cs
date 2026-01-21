using Microsoft.AspNetCore.Mvc;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
            => Ok(new { message = "Get all players (TODO)" });

        [HttpGet("{id:int}")]
        public IActionResult GetById([FromRoute] int id)
            => Ok(new { message = $"Get player {id} (TODO)" });

        [HttpGet("filter")]
        public IActionResult Filter([FromQuery] string? position, [FromQuery] string? team)
            => Ok(new { message = "Filter (TODO)", position, team });

        [HttpGet("stats")]
        public IActionResult Stats()
            => Ok(new { message = "Stats (TODO)" });
    }
}
