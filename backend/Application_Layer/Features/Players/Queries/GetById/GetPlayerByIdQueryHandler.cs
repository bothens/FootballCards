using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using MediatR;

namespace Application_Layer.Features.Players.Queries.GetById
{
    public sealed class GetPlayerByIdQueryHandler
        : IRequestHandler<GetPlayerByIdQuery, OperationResult<PlayerDetailsDto>>
    {
        public Task<OperationResult<PlayerDetailsDto>> Handle(
            GetPlayerByIdQuery request,
            CancellationToken cancellationToken)
        {
            var dto = new PlayerDetailsDto
            {
                Id = request.Id,
                Name = "",
                Team = "",
                Position = "",
                CurrentPrice = 0,
                PriceChange24h = 0
            };

            return Task.FromResult(OperationResult<PlayerDetailsDto>.Ok(dto));
        }
    }
}
