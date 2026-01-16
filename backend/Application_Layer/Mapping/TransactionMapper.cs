using Application_Layer.Features.Transactions.DTOs;
using AutoMapper;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application_Layer.Mapping
{
    public sealed class TransactionMapper : Profile
    {
        public TransactionMapper()
        {
            CreateMap<object, TransactionDto>();
        }
    }
}
