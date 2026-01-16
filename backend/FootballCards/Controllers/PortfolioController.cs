using Microsoft.AspNetCore.Mvc;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        [HttpGet("me")]
        public IActionResult GetMyPortfolio()
            => Ok(new { message = "My portfolio (TODO)" });
    }
}
