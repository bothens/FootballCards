using Application_Layer.Features.Players.DTOs;
using AutoMapper;
using Domain_Layer.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application_Layer.Mapping
{
    public sealed class PlayerMapper : Profile
    {
        public PlayerMapper()
        {
            CreateMap<CreatePlayerRequestDto, Player>();
            CreateMap<Player, PlayerDto>();
            CreateMap<object, PlayerDetailsDto>();
        }
    }
}
