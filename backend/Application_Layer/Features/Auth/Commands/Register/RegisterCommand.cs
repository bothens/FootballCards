using Application_Layer.Common.Models;
using Application_Layer.Features.Auth.DTOs;
using MediatR;

namespace Application_Layer.Features.Auth.Commands.Register
{
    public sealed record RegisterCommand(RegisterRequestDto Request) : IRequest<OperationResult<UserProfileDto>>;
}
