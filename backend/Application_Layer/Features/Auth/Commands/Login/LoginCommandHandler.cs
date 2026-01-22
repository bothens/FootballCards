<<<<<<< HEAD
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
=======
﻿using Application_Layer.Common.Models;
using Application_Layer.Features.Auth.DTOs;
using Application_Layer.Services;
using Infrastructure_Layer.Repositories.Interfaces;
using MediatR;
using IJwtTokenService = Application_Layer.Services.IJwtTokenService;

namespace Application_Layer.Features.Auth.Commands.Login
{
    
    public sealed class LoginCommandHandler
        : IRequestHandler<LoginCommand, OperationResult<AuthResponseDto>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordService _passwordService;
        private readonly IJwtTokenService _jwtTokenService;

        public LoginCommandHandler(
            IUserRepository userRepository,
            IPasswordService passwordService,
            IJwtTokenService jwtTokenService)
        {
            _userRepository = userRepository;
            _passwordService = passwordService;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<OperationResult<AuthResponseDto>> Handle(
            LoginCommand request,
            CancellationToken cancellationToken)
        {
            
            if (string.IsNullOrWhiteSpace(request.Request.Email) ||
                string.IsNullOrWhiteSpace(request.Request.Password))
            {
                return OperationResult<AuthResponseDto>.Fail(
                    "Email och lösenord krävs.");
            }

           
            var user = await _userRepository.GetByEmailAsync(
                request.Request.Email,
                cancellationToken);

            if (user is null)
            {
                return OperationResult<AuthResponseDto>.Fail(
                    "Fel email eller lösenord.");
            }

            
            var passwordOk = _passwordService.Verify(
                user.PasswordHash,
                request.Request.Password);

            if (!passwordOk)
            {
                return OperationResult<AuthResponseDto>.Fail(
                    "Fel email eller lösenord.");
            }

           
            var token = _jwtTokenService.CreateToken(user);

            
            var response = new AuthResponseDto
            {
                UserId = user.Id,
                DisplayName = user.DisplayName,
                Email = user.Email,
                Token = token
            };

            return OperationResult<AuthResponseDto>.Ok(response);
>>>>>>> main
        }
    }
}
