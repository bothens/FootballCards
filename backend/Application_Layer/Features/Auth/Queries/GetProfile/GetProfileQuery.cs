using Application_Layer.Common.Models;
using Application_Layer.Features.Auth.DTOs;
using MediatR;

namespace Application_Layer.Features.Auth.Queries.GetProfile
{
    public sealed record GetProfileQuery()
        : IRequest<OperationResult<UserProfileDto>>;
}
