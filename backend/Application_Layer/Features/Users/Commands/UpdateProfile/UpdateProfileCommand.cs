using Application_Layer.Common.Models;
using Application_Layer.Features.Users.DTOs;
using MediatR;

namespace Application_Layer.Features.Users.Commands.UpdateProfile
{
    public sealed record UpdateProfileCommand(int UserId, UpdateProfileRequestDto Request)
        : IRequest<OperationResult<UserProfileDto>>;
}
