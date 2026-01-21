using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using Domain_Layer.Entities;
using Infrastructure_Layer.Repositories.Interfaces;
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
                    CurrentPrice = dto.CurrentPrice
                };

                // Lägg till i databasen via repository
                await _playerRepository.AddAsync(player, cancellationToken);

                // Konvertera tillbaka till PlayerDto
                var resultDto = new PlayerDto
                {
                    Id = player.Id,
                    Name = player.Name,
                    Position = player.Position,
                    CurrentPrice = player.CurrentPrice,
                    Team = player.Team
                };

                return OperationResult<PlayerDto>.Ok(resultDto);
            }
            catch (Exception ex)
            {
                return OperationResult<PlayerDto>.Fail($"Could not create player: {ex.Message}");
            }
        }
    }
}