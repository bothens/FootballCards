using Microsoft.AspNetCore.Mvc;

namespace FootballCards.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Backend funkar!");
        }
    }
}
