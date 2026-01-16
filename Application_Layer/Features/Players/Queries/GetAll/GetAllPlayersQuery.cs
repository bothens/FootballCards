using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using MediatR;

namespace Application_Layer.Features.Players.Queries.GetAll
{
    public sealed record GetAllPlayersQuery()
        : IRequest<OperationResult<List<PlayerDto>>>;
}

