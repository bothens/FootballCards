using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Auth.DTOs;
using MediatR;

namespace Application_Layer.Features.Auth.Queries.GetProfile
{
    public sealed class GetProfileQueryHandler
        : IRequestHandler<GetProfileQuery, OperationResult<UserProfileDto>>
    {
        private readonly ICurrentUserService _currentUser;

        public GetProfileQueryHandler(ICurrentUserService currentUser)
        {
            _currentUser = currentUser;
        }

        public Task<OperationResult<UserProfileDto>> Handle(
            GetProfileQuery request,
            CancellationToken cancellationToken)
        {
            var profile = new UserProfileDto
            {
                UserId = _currentUser.UserId,
                Email = "",
                DisplayName = "",
                Token = ""
            };

            return Task.FromResult(OperationResult<UserProfileDto>.Ok(profile));
        }
    }
}
