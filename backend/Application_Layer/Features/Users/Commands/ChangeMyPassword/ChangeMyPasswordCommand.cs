using Application_Layer.Common.Models;
using Application_Layer.Features.Users.DTOs;
using MediatR;

namespace Application_Layer.Features.Users.Commands.ChangeMyPassword
{
    public sealed record ChangeMyPasswordCommand(int UserId, ChangePasswordRequestDto Dto)
        : IRequest<OperationResult<bool>>;
}
