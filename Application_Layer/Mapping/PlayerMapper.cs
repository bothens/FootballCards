using Application_Layer.Features.Players.DTOs;
using AutoMapper;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application_Layer.Mapping
{
    public sealed class PlayerMapper : Profile
    {
        public PlayerMapper()
        {
            CreateMap<object, PlayerDto>();
            CreateMap<object, PlayerDetailsDto>();
        }
    }
}
