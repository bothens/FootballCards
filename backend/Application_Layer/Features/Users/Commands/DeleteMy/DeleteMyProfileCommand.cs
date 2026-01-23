using Application_Layer.Common.Models;
using MediatR;

namespace Application_Layer.Features.Users.Commands.DeleteMy
{
    public sealed record DeleteMyProfileCommand(int UserId) : IRequest<OperationResult<bool>>;
}
