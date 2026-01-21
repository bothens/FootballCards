using Microsoft.AspNetCore.Mvc;

namespace FootballCards.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TradeController : ControllerBase
    {
        [HttpPost("buy")]
        public IActionResult Buy([FromBody] object request)
            => Ok(new { message = "Buy (TODO)" });

        [HttpPost("sell")]
        public IActionResult Sell([FromBody] object request)
            => Ok(new { message = "Sell (TODO)" });

        [HttpPost("bulk")]
        public IActionResult Bulk([FromBody] object request)
            => Ok(new { message = "Bulk (TODO)" });
    }
}
