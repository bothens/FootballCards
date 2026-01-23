using Application_Layer.Common.Models;
using Application_Layer.Features.Users.Commands.DeleteMy;
using Application_Layer.Features.Users.DTOs;
using Application_Layer.Features.Users.Queries.GetMyProfile;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UsersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("me")]
        public async Task<ActionResult<OperationResult<UserDto>>> GetMyProfile(
            CancellationToken cancellationToken)
        {
            //var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            //if (!int.TryParse(userIdClaim, out var userId))
            //    return Unauthorized(OperationResult<List<CardDto>>.Fail("User not authenticated"));
            // Hårdkodat UserId för test: TODO: hämta från JWT
            int userId = 10;

            var result = await _mediator.Send(
                new GetMyProfileQuery(userId),
                cancellationToken);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        [HttpDelete("me")]
        public async Task<ActionResult<OperationResult>> DeleteMyProfile(
    CancellationToken cancellationToken)
        {
            //var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            //if (!int.TryParse(userIdClaim, out var userId))
            //    return Unauthorized(OperationResult<List<CardDto>>.Fail("User not authenticated"));
            // TODO: Hämta userId från JWT i produktion
            int userId = 3; // Hårdkodat för test

            var result = await _mediator.Send(
                new DeleteMyProfileCommand(userId),
                cancellationToken);

            if (!result.Success)
                return BadRequest(result.Data);

            return Ok(result.Data);
        }
    }
}
