using Application_Layer.Common.Models;
using Application_Layer.Features.Players.DTOs;
using MediatR;

namespace Application_Layer.Features.Players.Queries.GetById
{
    public sealed record GetPlayerByIdQuery(int Id)
        : IRequest<OperationResult<PlayerDetailsDto>>;
}
