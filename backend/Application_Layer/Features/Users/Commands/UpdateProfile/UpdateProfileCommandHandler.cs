using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Users.DTOs;
using MediatR;

namespace Application_Layer.Features.Users.Commands.UpdateProfile
{
    public sealed class UpdateProfileCommandHandler
        : IRequestHandler<UpdateProfileCommand, OperationResult<UserProfileDto>>
    {
        private readonly IUserRepository _users;

        public UpdateProfileCommandHandler(IUserRepository users)
        {
            _users = users;
        }

        public async Task<OperationResult<UserProfileDto>> Handle(
            UpdateProfileCommand request,
            CancellationToken cancellationToken)
        {
            var user = await _users.GetByIdAsync(request.UserId, cancellationToken);
            if (user is null)
                return OperationResult<UserProfileDto>.Fail("User not found");

            var displayName = request.Request.DisplayName?.Trim() ?? "";
            if (string.IsNullOrWhiteSpace(displayName))
                return OperationResult<UserProfileDto>.Fail("DisplayName is required");

            user.DisplayName = displayName;

            await _users.UpdateAsync(user, cancellationToken);

            var dto = new UserProfileDto
            {
                UserId = user.UserId,
                Email = user.Email,
                DisplayName = user.DisplayName
            };

            return OperationResult<UserProfileDto>.Ok(dto);
        }
    }
}
