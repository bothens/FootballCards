using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Auth.DTOs;
using MediatR;

namespace Application_Layer.Features.Auth.Commands.Register
{
    public sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, OperationResult<UserProfileDto>>
    {
        private readonly IJwtTokenService _jwt;

        public RegisterCommandHandler(IJwtTokenService jwt)
        {
            _jwt = jwt;
        }

        public Task<OperationResult<UserProfileDto>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var userId = Guid.NewGuid();

            var profile = new UserProfileDto
            {
                UserId = userId,
                Email = request.Request.Email.Trim(),
                DisplayName = request.Request.DisplayName.Trim(),
                Token = _jwt.GenerateToken(userId, request.Request.Email.Trim())
            };

            return Task.FromResult(OperationResult<UserProfileDto>.Ok(profile));
        }
    }
}
