using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Users.DTOs;
using Application_Layer.Services;
using Domain_Layer.Entities;
using MediatR;

namespace Application_Layer.Features.Auth.Commands.Register
{
    public sealed class RegisterCommandHandler
        : IRequestHandler<RegisterCommand, OperationResult<UserProfileDto>>
    {
        private readonly IUserRepository _users;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenService _jwt;
        private readonly int Userid;

        public RegisterCommandHandler(
            IUserRepository users,
            IPasswordHasher passwordHasher,
            IJwtTokenService jwt)
        {
            _users = users;
            _passwordHasher = passwordHasher;
            _jwt = jwt;
        }

        public async Task<OperationResult<UserProfileDto>> Handle(RegisterCommand request, CancellationToken ct)
        {
            var email = request.Request.Email.Trim().ToLowerInvariant();
            var password = request.Request.Password;
            var displayName = request.Request.DisplayName?.Trim();

            var existing = await _users.GetByEmailAsync(email, ct);
            if (existing is not null)
                return OperationResult<UserProfileDto>.Fail("Email finns redan.");

            var user = new User
            {
                Email = email,
                DisplayName = string.IsNullOrWhiteSpace(displayName) ? email.Split('@')[0] : displayName,
                PasswordHash = _passwordHasher.Hash(password),
                CreatedAt = DateTime.UtcNow
            };

            await _users.AddAsync(user, ct);

            var token = _jwt.CreateToken(user);

            return OperationResult<UserProfileDto>.Ok(new UserProfileDto
            {
                UserId = user.UserId,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = token
            });
        }
    }
}
