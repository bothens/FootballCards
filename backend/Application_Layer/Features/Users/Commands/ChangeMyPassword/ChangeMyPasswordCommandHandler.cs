using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using MediatR;

namespace Application_Layer.Features.Users.Commands.ChangeMyPassword
{
    public sealed class ChangeMyPasswordCommandHandler
            : IRequestHandler<ChangeMyPasswordCommand, OperationResult<bool>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;

        public ChangeMyPasswordCommandHandler(
            IUserRepository userRepository,
            IPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _passwordHasher = passwordHasher;
        }

        public async Task<OperationResult<bool>> Handle(
            ChangeMyPasswordCommand request,
            CancellationToken ct)
        {
            try
            {
                var user = await _userRepository.GetByUserIdAsync(request.UserId, ct);
                if (user == null)
                    return OperationResult<bool>.Fail("User not found");

                if (!_passwordHasher.Verify(request.Dto.OldPassword, user.PasswordHash))
                    return OperationResult<bool>.Fail("Old password is incorrect");

                user.PasswordHash = _passwordHasher.Hash(request.Dto.NewPassword);
                await _userRepository.UpdateAsync(user, ct);

                return OperationResult<bool>.Ok(true);
            }
            catch (Exception ex)
            {
                return OperationResult<bool>.Fail(ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
