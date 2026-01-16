using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using MediatR;

namespace Application_Layer.Features.Players.Queries.Filter
{
    public sealed record FilterPlayersQuery(PlayerFilterRequestDto Filter)
        : IRequest<OperationResult<List<PlayerDto>>>;
}
