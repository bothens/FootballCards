using System.Security.Claims;
using Application_Layer.Features.Users.Commands.UpdateProfile;
using Application_Layer.Features.Users.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public sealed class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UsersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe(
            [FromBody] UpdateProfileRequestDto request,
            CancellationToken cancellationToken)
        {
            var userIdClaim =
                User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");

            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid token");

            var result = await _mediator.Send(
                new UpdateProfileCommand(userId, request),
                cancellationToken);

            return result.Success
                ? Ok(result.Data)
                : BadRequest(result.Error);
        }
    }
}
