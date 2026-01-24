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

namespace FootballCards.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUser;

        public UsersController(IMediator mediator, ICurrentUserService currentUser)
        {
            _mediator = mediator;
            _currentUser = currentUser;
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
                return BadRequest(result.Data);

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
                return BadRequest(result.Data);

            return Ok(result.Data);
        }
    }
}
