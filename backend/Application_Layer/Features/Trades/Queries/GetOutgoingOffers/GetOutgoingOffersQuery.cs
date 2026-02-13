using Application_Layer.Common.Models;
using Application_Layer.Features.Trades.DTOs;
using MediatR;

namespace Application_Layer.Features.Trades.Queries.GetOutgoingOffers
{
    public sealed record GetOutgoingOffersQuery(int UserId)
        : IRequest<OperationResult<List<TradeOfferDto>>>;
}
