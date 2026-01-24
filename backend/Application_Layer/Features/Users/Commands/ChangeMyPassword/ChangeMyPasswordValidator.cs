using Application_Layer.Common.Validators;
using FluentValidation;

namespace Application_Layer.Features.Users.Commands.ChangeMyPassword
{
    public sealed class ChangeMyPasswordValidator : AbstractValidator<ChangeMyPasswordCommand>
    {
        public ChangeMyPasswordValidator()
        {
            RuleFor(x => x.Dto.OldPassword)
                .NotEmpty()
                .WithMessage("Old password must be provided");

            RuleFor(x => x.Dto.NewPassword)
                .ApplyPasswordRules()
                .NotEqual(x => x.Dto.OldPassword)
                .WithMessage("New password cannot be the same as the old password");
        }
    }
}
