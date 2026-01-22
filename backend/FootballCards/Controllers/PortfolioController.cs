using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
using Application_Layer.Features.Market.Commands.Sell;
using Application_Layer.Features.Portfolio.Queries.GetMyPortfolio;
using Azure.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PortfolioController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PortfolioController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("my")]
        public async Task<ActionResult<OperationResult<List<CardDto>>>> GetMyPortfolio(
            [FromQuery] string? search,
            [FromQuery] string? filter,
            [FromQuery] string? sort, 
            CancellationToken cancellationToken)
        {
            //// Här skickar vi in UserId som int från claims
            //var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            //if (!int.TryParse(userIdClaim, out var userId))
            //    return Unauthorized(OperationResult<List<CardDto>>.Fail("User not authenticated"));
            // Hårdkodat UserId för test: TODO: hämta från JWT
            int userId = 10;

            var result = await _mediator.Send(
                new GetMyPortfolioQuery(userId, search, filter, sort),
                cancellationToken);

            if (!result.Success)
                return BadRequest(result.Data);

            return Ok(result.Data);
        }
    }
}
