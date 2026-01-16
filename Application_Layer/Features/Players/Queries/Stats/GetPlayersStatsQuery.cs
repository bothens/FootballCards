using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using MediatR;

namespace Application_Layer.Features.Players.Queries.Stats
{
    public sealed record GetPlayersStatsQuery()
        : IRequest<OperationResult<PlayerStatsResponseDto>>;
}
