using Application_Layer.Features.Portfolio.DTOs;
using AutoMapper;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application_Layer.Mapping
{
    public sealed class PortfolioMapper : Profile
    {
        public PortfolioMapper()
        {
            CreateMap<object, PortfolioDto>();
            CreateMap<object, PortfolioItemDto>();
        }
    }
}
