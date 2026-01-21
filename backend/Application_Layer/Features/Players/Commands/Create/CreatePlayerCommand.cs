using MediatR;
using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;

namespace Application_Layer.Features.Players.Commands.Create
{
    public sealed record CreatePlayerCommand(CreatePlayerRequestDto Player)
        : IRequest<OperationResult<PlayerDto>>;
}
