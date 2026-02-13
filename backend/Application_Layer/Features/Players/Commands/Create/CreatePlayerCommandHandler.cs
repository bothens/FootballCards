using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using Domain_Layer.Entities;
using MediatR;

namespace Application_Layer.Features.Players.Commands.Create
{
    public sealed class CreatePlayerCommandHandler : IRequestHandler<CreatePlayerCommand, OperationResult<PlayerDto>>
    {
        private readonly IPlayerRepository _playerRepository;

        public CreatePlayerCommandHandler(IPlayerRepository playerRepository)
        {
            _playerRepository = playerRepository;
        }

        public async Task<OperationResult<PlayerDto>> Handle(CreatePlayerCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var dto = request.Player;

                // Skapa entitet från DTO
                var player = new Player
                {
                    Name = dto.Name,
                    Position = dto.Position,
                    ImageUrl = dto.ImageUrl,
                    Team = dto.Team
                };

                // Lägg till i databasen via repository
                await _playerRepository.AddAsync(player, cancellationToken);

                // Konvertera tillbaka till PlayerDto
                var resultDto = new PlayerDto
                {
                    Id = player.Id,
                    Name = player.Name,
                    Position = player.Position,
                    Team = player.Team,
                    ImageUrl = player.ImageUrl
                };

                return OperationResult<PlayerDto>.Ok(resultDto);
            }
            catch (Exception ex)
            {
                return OperationResult<PlayerDto>.Fail($"Kunde inte skapa spelare: {ex.Message}");
            }
        }
    }
}
