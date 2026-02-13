using System.Security.Claims;
using Application_Layer.Features.Users.Commands.UpdateProfile;
﻿using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Users.Commands.ChangeMyPassword;
using Application_Layer.Features.Users.Commands.DeleteMy;
using Application_Layer.Features.Users.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUser;
        private readonly IUserRepository _users;

        public UsersController(IMediator mediator, ICurrentUserService currentUser, IUserRepository users)
        {
            _mediator = mediator;
            _currentUser = currentUser;
            _users = users;
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe(
            [FromBody] UpdateProfileRequestDto request,
            CancellationToken cancellationToken)
        {

            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<UserDto>.Fail("User not authenticated"));

            var result = await _mediator.Send(
                new UpdateProfileCommand(userId, request),
                cancellationToken);

            return result.Success
                ? Ok(result.Data)
                : BadRequest(result.Error);

        }

        [HttpDelete("me")]
        public async Task<ActionResult<OperationResult>> DeleteMyProfile(
    CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<UserDto>.Fail("User not authenticated"));

            var result = await _mediator.Send(
                new DeleteMyProfileCommand(userId),
                cancellationToken);

            if (!result.Success)
                return BadRequest(result.Error);

            return Ok(result.Data);
        }

        [HttpPut("me/password")]
        public async Task<ActionResult<OperationResult<bool>>> ChangeMyPassword(
            [FromBody] ChangePasswordRequestDto dto,
            CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            if (userId == 0)
                return Unauthorized(OperationResult<UserDto>.Fail("User not authenticated"));

            var result = await _mediator.Send(
                new ChangeMyPasswordCommand(userId, dto),
                cancellationToken);

            if (!result.Success)
                return BadRequest(result.Error);

            return Ok(result.Data);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [FromQuery] string query,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return Ok(new List<UserProfileDto>());
            }

            var users = await _users.SearchAsync(query, 10, cancellationToken);
            var result = users.Select(u => new UserProfileDto
            {
                UserId = u.UserId,
                Email = u.Email,
                DisplayName = u.DisplayName,
                UserRole = u.UserRole,
                Balance = u.Balance,
                ImageUrl = u.ImageUrl
            }).ToList();

            return Ok(result);
        }
    }
}
