using Application_Layer.Common.Models;
using Application_Layer.Features.Trades.DTOs;
using MediatR;

namespace Application_Layer.Features.Trades.Queries.GetIncomingOffers
{
    public sealed record GetIncomingOffersQuery(int UserId)
        : IRequest<OperationResult<List<TradeOfferDto>>>;
}
