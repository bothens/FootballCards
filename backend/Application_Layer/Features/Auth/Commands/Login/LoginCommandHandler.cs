using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Auth.DTOs;
using MediatR;

namespace Application_Layer.Features.Auth.Commands.Login
{
    public sealed class LoginCommandHandler
        : IRequestHandler<LoginCommand, OperationResult<UserProfileDto>>
    {
        private readonly IJwtTokenService _jwt;

        public LoginCommandHandler(IJwtTokenService jwt)
        {
            _jwt = jwt;
        }

        public Task<OperationResult<UserProfileDto>> Handle(
            LoginCommand request,
            CancellationToken cancellationToken)
        {
            var userId = Guid.NewGuid();

            var profile = new UserProfileDto
            {
                UserId = userId,
                Email = request.Request.Email.Trim(),
                DisplayName = request.Request.Email.Trim(),
                Token = _jwt.GenerateToken(userId, request.Request.Email.Trim())
            };

            return Task.FromResult(OperationResult<UserProfileDto>.Ok(profile));
        }
    }
}
