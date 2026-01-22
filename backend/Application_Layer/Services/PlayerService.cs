using Application_Layer.Features.Players.DTOs;

namespace Application_Layer.Services
{
    public sealed class PlayerService
    {
        public List<PlayerDto> GetAll()
            => [];

        public PlayerDetailsDto? GetById(int id)
            => null;

        public List<PlayerDto> Filter(PlayerFilterRequestDto filter)
            => [];

        public PlayerStatsResponseDto GetStats()
            => new();
    }
}
