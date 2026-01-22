using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Auth.DTOs;
using Domain_Layer.Entities;
using MediatR;

namespace Application_Layer.Features.Auth.Commands.Register
{
    public sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, OperationResult<UserProfileDto>>
    {
        private readonly IJwtTokenService _jwt;
        private readonly IUserRepository _users;
        private readonly IPasswordHasher _passwordHasher;

        public RegisterCommandHandler(
            IJwtTokenService jwt,
            IUserRepository users,
            IPasswordHasher passwordHasher)
        {
            _jwt = jwt;
            _users = users;
            _passwordHasher = passwordHasher;
        }

        public async Task<OperationResult<UserProfileDto>> Handle(
            RegisterCommand request,
            CancellationToken cancellationToken)
        {
            var email = request.Request.Email.Trim();
            var displayName = request.Request.DisplayName.Trim();

            if (await _users.EmailExistsAsync(email, cancellationToken))
            {
                return OperationResult<UserProfileDto>.Fail("Email already exists");
            }

            var userId = Guid.NewGuid();
            var user = new User
            {
                Id = userId,
                Email = email,
                DisplayName = displayName,
                PasswordHash = _passwordHasher.Hash(request.Request.Password),
                CreatedAt = DateTime.UtcNow
            };

            await _users.AddAsync(user, cancellationToken);
            await _users.SaveChangesAsync(cancellationToken);

            var profile = new UserProfileDto
            {
                UserId = userId,
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = _jwt.GenerateToken(userId, user.Email)
            };

            return OperationResult<UserProfileDto>.Ok(profile);
        }
    }
}
