using Application_Layer.Common.Models;
using Application_Layer.Features.Portfolio.DTOs;
using MediatR;

namespace Application_Layer.Features.Portfolio.Queries.GetMyPortfolio
{
    public sealed record GetMyPortfolioQuery()
        : IRequest<OperationResult<PortfolioDto>>;
}
