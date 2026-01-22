using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using MediatR;

namespace Application_Layer.Features.Players.Queries.Filter
{
    public sealed class FilterPlayersQueryHandler
        : IRequestHandler<FilterPlayersQuery, OperationResult<List<PlayerDto>>>
    {
        public Task<OperationResult<List<PlayerDto>>> Handle(
            FilterPlayersQuery request,
            CancellationToken cancellationToken)
        {
            var players = new List<PlayerDto>();

            return Task.FromResult(OperationResult<List<PlayerDto>>.Ok(players));
        }
    }
}
