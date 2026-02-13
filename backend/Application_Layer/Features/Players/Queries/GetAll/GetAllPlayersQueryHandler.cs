using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using MediatR;

namespace Application_Layer.Features.Players.Queries.GetAll
{
    public sealed class GetAllPlayersQueryHandler
        : IRequestHandler<GetAllPlayersQuery, OperationResult<List<PlayerDto>>>
    {
        private readonly IPlayerRepository _playerRepository;

        public GetAllPlayersQueryHandler(IPlayerRepository playerRepository)
        {
            _playerRepository = playerRepository;
        }

        public async Task<OperationResult<List<PlayerDto>>> Handle(
            GetAllPlayersQuery request,
            CancellationToken cancellationToken)
        {
            // Hämtar alla spelare från databasen
            var players = await _playerRepository.GetAllAsync(cancellationToken);

            // Konvertera till DTO
            var playerDtos = players.Select(p => new PlayerDto
            {
                Id = p.Id,
                Name = p.Name,
                Position = p.Position,
                Team = p.Team,
                ImageUrl = p.ImageUrl
            }).ToList();

            return OperationResult<List<PlayerDto>>.Ok(playerDtos);
        }
    }
}
