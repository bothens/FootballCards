using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Users.DTOs;
using MediatR;

namespace Application_Layer.Features.Users.Queries.GetMyProfile
{
    public sealed class GetMyProfileQueryHandler
        : IRequestHandler<GetMyProfileQuery, OperationResult<UserDto>>
    {
        private readonly IUserRepository _userRepository;

        public GetMyProfileQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<OperationResult<UserDto>> Handle(
            GetMyProfileQuery request,
            CancellationToken cancellationToken)
        {
            try
            {
                var user = await _userRepository.GetByUserIdAsync(request.UserId, cancellationToken);
                if (user == null)
                    return OperationResult<UserDto>.Fail("User not found");

                var dto = new UserDto
                {
                    DisplayName = user.DisplayName,
                    Email = user.Email,
                    UserId = user.UserId,
                    CreatedAt = user.CreatedAt
                };

                return OperationResult<UserDto>.Ok(dto);
            }
            catch (Exception ex)
            {
                return OperationResult<UserDto>.Fail(ex.Message);
            }
        }

    }

}