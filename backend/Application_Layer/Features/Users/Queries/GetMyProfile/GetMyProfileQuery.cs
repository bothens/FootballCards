using Application_Layer.Common.Models;
using Application_Layer.Features.Users.DTOs;
using MediatR;

namespace Application_Layer.Features.Users.Queries.GetMyProfile
{
    public sealed record GetMyProfileQuery(int UserId)
        : IRequest<OperationResult<UserDto>>;
}
