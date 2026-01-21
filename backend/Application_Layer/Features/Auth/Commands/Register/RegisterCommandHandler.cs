using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Services;

using Application_Layer.Features.Auth.DTOs;
using Domain_Layer.Entities;
using Infrastructure_Layer.Repositories.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application_Layer.Features.Auth.Commands.Register
{
    public sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, OperationResult<UserProfileDto>>
    {
        private readonly IUserRepository _users;
        private readonly IJwtTokenService _jwt;
        private readonly PasswordHasher<User> _hasher = new();

        public RegisterCommandHandler(IUserRepository users, IJwtTokenService jwt)
        {
            _users = users;
            _jwt = jwt;
        }

        public async Task<OperationResult<UserProfileDto>> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var email = request.Request.Email.Trim();
            var displayName = request.Request.DisplayName.Trim();

            if (await _users.EmailExistsAsync(email, cancellationToken))
                return OperationResult<UserProfileDto>.Fail("Email is already registered.");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                DisplayName = displayName,
                CreatedAt = DateTime.UtcNow
            };

            user.PasswordHash = _hasher.HashPassword(user, request.Request.Password);

            await _users.AddAsync(user, cancellationToken);
            await _users.SaveChangesAsync(cancellationToken);

            var profile = new UserProfileDto
            {
                UserId = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = _jwt.CreateToken(user)
            };

            return OperationResult<UserProfileDto>.Ok(profile);
        }
    }
}
