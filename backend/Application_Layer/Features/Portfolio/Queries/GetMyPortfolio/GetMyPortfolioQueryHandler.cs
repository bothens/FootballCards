using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Portfolio.DTOs;
using MediatR;

namespace Application_Layer.Features.Portfolio.Queries.GetMyPortfolio
{
    public sealed class GetMyPortfolioQueryHandler
        : IRequestHandler<GetMyPortfolioQuery, OperationResult<PortfolioDto>>
    {
        private readonly ICurrentUserService _currentUser;

        public GetMyPortfolioQueryHandler(ICurrentUserService currentUser)
        {
            _currentUser = currentUser;
        }

        public Task<OperationResult<PortfolioDto>> Handle(
            GetMyPortfolioQuery request,
            CancellationToken cancellationToken)
        {
            var dto = new PortfolioDto
            {
                UserId = _currentUser.UserId,
                TotalValue = 0,
                Items = []
            };

            return Task.FromResult(OperationResult<PortfolioDto>.Ok(dto));
        }
    }
}
