using Application_Layer.Common.Models;
using Application_Layer.Features.Market.DTOs;
using MediatR;

namespace Application_Layer.Features.Market.Commands.OpenPack
{
    public sealed record OpenPackCommand(int UserId, string PackType)
        : IRequest<OperationResult<OpenPackResultDto>>;
}
