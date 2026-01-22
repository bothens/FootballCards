using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
using MediatR;

namespace Application_Layer.Features.Market.Queries
{
    public sealed record GetMarketCardsQuery(
        string? Search,
        string? Filter,
        string? Sort
    ) : IRequest<OperationResult<List<CardDto>>>;
}
