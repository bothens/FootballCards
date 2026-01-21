using Application_Layer.Features.Auth.Commands.Login;
using Application_Layer.Features.Auth.Commands.Register;
using Application_Layer.Features.Auth.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegisterRequestDto request,
            CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new RegisterCommand(request), cancellationToken);

            return result.Success
                ? Ok(result.Data)
                : BadRequest(result.Error);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginRequestDto request,
            CancellationToken cancellationToken)
        {
            
            var result = await _mediator.Send(new LoginCommand(request), cancellationToken);

            return result.Success
                ? Ok(result.Data)
                : Unauthorized(result.Error);
        }

        [HttpGet("profile")]
        public IActionResult Profile()
        {
            return Ok(new { message = "Profile (TODO)" });
        }
    }
}
