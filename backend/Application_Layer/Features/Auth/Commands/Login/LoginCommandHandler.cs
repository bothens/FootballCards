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
        private readonly IUserRepository _users;
        private readonly IPasswordHasher _passwordHasher;

        public LoginCommandHandler(
            IJwtTokenService jwt,
            IUserRepository users,
            IPasswordHasher passwordHasher)
        {
            _jwt = jwt;
            _users = users;
            _passwordHasher = passwordHasher;
        }

        public async Task<OperationResult<UserProfileDto>> Handle(
            LoginCommand request,
            CancellationToken cancellationToken)
        {
            var email = request.Request.Email.Trim();
            var user = await _users.GetByEmailAsync(email, cancellationToken);

            if (user is null || !_passwordHasher.Verify(request.Request.Password, user.PasswordHash))
            {
                return OperationResult<UserProfileDto>.Fail("Invalid email or password");
            }

            var profile = new UserProfileDto
            {
                UserId = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = _jwt.GenerateToken(user.Id, user.Email)
            };

            return OperationResult<UserProfileDto>.Ok(profile);
        }
    }
}
