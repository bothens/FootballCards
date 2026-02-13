using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Trades.Commands.AcceptOffer;
using Application_Layer.Features.Trades.Commands.CreateOffer;
using Application_Layer.Features.Trades.Commands.RejectOffer;
using Application_Layer.Features.Trades.DTOs;
using Application_Layer.Features.Trades.Queries.GetIncomingOffers;
using Application_Layer.Features.Trades.Queries.GetOutgoingOffers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public sealed class TradesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUser;

        public TradesController(IMediator mediator, ICurrentUserService currentUser)
        {
            _mediator = mediator;
            _currentUser = currentUser;
        }

        [HttpGet("incoming")]
        public async Task<IActionResult> Incoming(CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<List<TradeOfferDto>>.Fail("User not authenticated"));

            var result = await _mediator.Send(new GetIncomingOffersQuery(userId), cancellationToken);
            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }

        [HttpGet("outgoing")]
        public async Task<IActionResult> Outgoing(CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<List<TradeOfferDto>>.Fail("User not authenticated"));

            var result = await _mediator.Send(new GetOutgoingOffersQuery(userId), cancellationToken);
            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }

        [HttpPost("offer")]
        public async Task<IActionResult> Offer(
            [FromBody] CreateTradeOfferDto request,
            CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<TradeOfferDto>.Fail("User not authenticated"));

            var result = await _mediator.Send(
                new CreateTradeOfferCommand(userId, request.ToUserId, request.CardId, request.Price),
                cancellationToken);

            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }

        [HttpPost("accept")]
        public async Task<IActionResult> Accept(
            [FromBody] TradeOfferActionDto request,
            CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<TradeOfferDto>.Fail("User not authenticated"));

            var result = await _mediator.Send(
                new AcceptTradeOfferCommand(userId, request.TradeOfferId),
                cancellationToken);

            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }

        [HttpPost("reject")]
        public async Task<IActionResult> Reject(
            [FromBody] TradeOfferActionDto request,
            CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<TradeOfferDto>.Fail("User not authenticated"));

            var result = await _mediator.Send(
                new RejectTradeOfferCommand(userId, request.TradeOfferId),
                cancellationToken);

            return result.Success ? Ok(result.Data) : BadRequest(result.Error);
        }
    }
}
