using Application_Layer.Features.Market.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

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
}
