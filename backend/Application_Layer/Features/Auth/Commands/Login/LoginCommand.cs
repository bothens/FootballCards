using Application_Layer.Common.Models;
using Application_Layer.Features.Auth.DTOs;
using Application_Layer.Features.Users.DTOs;
using MediatR;

namespace Application_Layer.Features.Auth.Commands.Login
{
    public sealed record LoginCommand(LoginRequestDto Request)
        : IRequest<OperationResult<UserProfileDto>>;
}
