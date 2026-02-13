using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using MediatR;

namespace Application_Layer.Features.Players.Queries.GetById
{
    public sealed class GetPlayerByIdQueryHandler
        : IRequestHandler<GetPlayerByIdQuery, OperationResult<PlayerDetailsDto>>
    {
        private readonly IPlayerRepository _players;

        public GetPlayerByIdQueryHandler(IPlayerRepository players)
        {
            _players = players;
        }

        public async Task<OperationResult<PlayerDetailsDto>> Handle(
            GetPlayerByIdQuery request,
            CancellationToken cancellationToken)
        {
            var player = await _players.GetByIdAsync(request.Id, cancellationToken);
            if (player == null)
            {
                return OperationResult<PlayerDetailsDto>.Fail("Player not found");
            }

            var dto = new PlayerDetailsDto
            {
                Id = player.Id,
                Name = player.Name,
                Team = player.Team,
                Position = player.Position,
                ImageUrl = player.ImageUrl
            };

            return OperationResult<PlayerDetailsDto>.Ok(dto);
        }
    }
}
