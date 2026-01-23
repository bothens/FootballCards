using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
using MediatR;

namespace Application_Layer.Features.Portfolio.Queries.GetMyPortfolio
{
    public sealed record GetMyPortfolioQuery(
        int UserId,
        string? Search,
        string? Filter,
        string? Sort
    ) : IRequest<OperationResult<List<CardDto>>>;
}
