using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Users.DTOs;
using Application_Layer.Services;
using MediatR;
using Microsoft.Extensions.Configuration;
using System.Threading;
using System.Threading.Tasks;

namespace Application_Layer.Features.Auth.Commands.Login
{
    public sealed class LoginCommandHandler
        : IRequestHandler<LoginCommand, OperationResult<UserProfileDto>>
    {
        private readonly IJwtTokenService _jwt;
        private readonly IUserRepository _users;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IConfiguration _config;

        public LoginCommandHandler(
            IJwtTokenService jwt,
            IUserRepository users,
            IPasswordHasher passwordHasher,
            IConfiguration config)
        {
            _jwt = jwt;
            _users = users;
            _passwordHasher = passwordHasher;
            _config = config;
        }

        public async Task<OperationResult<UserProfileDto>> Handle(
            LoginCommand request,
            CancellationToken cancellationToken)
        {
            var email = request.Request.Email.Trim();
            var user = await _users.GetByEmailAsync(email, cancellationToken);

            if (user is null || !_passwordHasher.Verify(request.Request.Password, user.PasswordHash))
                return OperationResult<UserProfileDto>.Fail("Invalid email or password");

            var adminEmail = _config["Admin:Email"];
            if (!string.IsNullOrWhiteSpace(adminEmail)
                && user.Email.Equals(adminEmail, StringComparison.OrdinalIgnoreCase)
                && !string.Equals(user.UserRole, "admin", StringComparison.OrdinalIgnoreCase))
            {
                user.UserRole = "admin";
                await _users.UpdateAsync(user, cancellationToken);
            }

            var token = _jwt.CreateToken(user);

            var profile = new UserProfileDto
            {
                UserId = user.UserId,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = token,
                UserRole = user.UserRole,
                Balance = user.Balance,
                ImageUrl = user.ImageUrl
            };

            return OperationResult<UserProfileDto>.Ok(profile);
        }
    }
}
