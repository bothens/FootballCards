using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using MediatR;

namespace Application_Layer.Features.Players.Queries.Stats
{
    public sealed class GetPlayersStatsQueryHandler
        : IRequestHandler<GetPlayersStatsQuery, OperationResult<PlayerStatsResponseDto>>
    {
        public Task<OperationResult<PlayerStatsResponseDto>> Handle(
            GetPlayersStatsQuery request,
            CancellationToken cancellationToken)
        {
            var dto = new PlayerStatsResponseDto
            {
                TotalPlayers = 0,
            };

            return Task.FromResult(OperationResult<PlayerStatsResponseDto>.Ok(dto));
        }
    }
}
