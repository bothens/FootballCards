using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Market.Commands.Purchase;
using Application_Layer.Features.Market.Commands.Sell;
using Application_Layer.Features.Market.DTOs;
using Application_Layer.Features.Market.Queries;
using Application_Layer.Features.Users.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class MarketController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;

    public MarketController(IMediator mediator, ICurrentUserService currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
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
        var userId = _currentUser.UserId;
        if (userId == 0)
            return Unauthorized(OperationResult<UserDto>.Fail("User not authenticated"));

        int buyerId = userId;

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
    {
        var userId = _currentUser.UserId;
        if (userId == 0)
            return Unauthorized(OperationResult<UserDto>.Fail("User not authenticated"));

        int sellerId = userId;

        var result = await _mediator.Send(
            new SellCardCommand(sellerId, request.CardId, request.SellingPrice),
            cancellationToken);

        return result.Success
            ? Ok(result.Data)
            : BadRequest(result.Error);
    }
}
