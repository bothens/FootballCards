using Microsoft.AspNetCore.Mvc;

namespace FootballCards.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        [HttpGet("me")]
        public IActionResult GetMyHistory()
            => Ok(new { message = "My transactions (TODO)" });
    }
}
