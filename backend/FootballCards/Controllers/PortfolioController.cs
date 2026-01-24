using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
using Application_Layer.Features.Portfolio.Queries.GetMyPortfolio;
using Application_Layer.Features.Users.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PortfolioController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUser;

        public PortfolioController(IMediator mediator, ICurrentUserService currentUser)
        {
            _mediator = mediator;
            _currentUser = currentUser;
        }

        [HttpGet("me")]
        public async Task<ActionResult<OperationResult<List<CardDto>>>> GetMyPortfolio(
            [FromQuery] string? search,
            [FromQuery] string? filter,
            [FromQuery] string? sort, 
            CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<UserDto>.Fail("User not authenticated"));

            var result = await _mediator.Send(
                new GetMyPortfolioQuery(userId, search, filter, sort),
                cancellationToken);

            if (!result.Success)
                return BadRequest(result.Data);

            return Ok(result.Data);
        }
    }
}
