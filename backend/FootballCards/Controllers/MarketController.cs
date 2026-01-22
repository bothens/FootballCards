using Application_Layer.Features.Market.Commands.Purchase;
using Application_Layer.Features.Market.Commands.Sell;
using Application_Layer.Features.Market.DTOs;
using Application_Layer.Features.Market.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public sealed class MarketController : ControllerBase
{
    private readonly IMediator _mediator;

    public MarketController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetMarketCards(
        [FromQuery] string? search,
        [FromQuery] string? filter,
        [FromQuery] string? sort,
        CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(
            new GetMarketCardsQuery(search, filter, sort),
            cancellationToken);

        return result.Success
            ? Ok(result.Data)
            : BadRequest(result.Error);
    }

    [HttpPost("purchase")]
    //[Authorize]
    public async Task<IActionResult> Purchase(
           [FromBody] PurchaseCardRequestDto request,
           CancellationToken cancellationToken)
    {
        // ================================
        // NOTE: BuyerId is currently hardcoded to 10 for testing purposes.
        // The JWT authentication logic is commented out below so that
        // we can test the purchase flow without requiring login.
        // TODO: Replace hardcoded BuyerId with the value from JWT when auth is implemented.
        // ================================

        //// Hämta BuyerId från JWT
        //var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //if (string.IsNullOrWhiteSpace(userIdClaim))
        //{
        //    return Unauthorized("User id missing in token");
        //}

        //if (!int.TryParse(userIdClaim, out var buyerId))
        //{
        //    return Unauthorized("Invalid user id in token");
        //}
        int buyerId = 10;


        var result = await _mediator.Send(
            new PurchaseCardCommand(buyerId, request.CardId),
            cancellationToken);

        return result.Success
            ? Ok(result.Data)
            : BadRequest(result.Error);
    }

    [HttpPost("sell")]
    public async Task<IActionResult> Sell(
            [FromBody] SellCardRequestDto request,
            CancellationToken cancellationToken)
    {        //// Hämta SellerId från JWT
        //var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //if (string.IsNullOrWhiteSpace(userIdClaim))
        //{
        //    return Unauthorized("User id missing in token");
        //}

        //if (!int.TryParse(userIdClaim, out var sellerId))
        //{
        //    return Unauthorized("Invalid user id in token");
        //}
        // Hårdkodat SellerId för test; TODO: hämta från JWT
        int sellerId = 10;

        var result = await _mediator.Send(
            new SellCardCommand(sellerId, request.CardId, request.SellingPrice),
            cancellationToken);

        return result.Success
            ? Ok(result.Data)
            : BadRequest(result.Error);
    }
}
