using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using MediatR;

namespace Application_Layer.Features.Players.Queries.GetAll
{
    public sealed class GetAllPlayersQueryHandler
        : IRequestHandler<GetAllPlayersQuery, OperationResult<List<PlayerDto>>>
    {
        public Task<OperationResult<List<PlayerDto>>> Handle(
            GetAllPlayersQuery request,
            CancellationToken cancellationToken)
        {
            var players = new List<PlayerDto>();

            return Task.FromResult(OperationResult<List<PlayerDto>>.Ok(players));
        }
    }
}
