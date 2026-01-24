using Application_Layer.Common.Validators;
using FluentValidation;

namespace Application_Layer.Features.Auth.Commands.Register
{
    public sealed class RegisterValidator : AbstractValidator<RegisterCommand>
    {
        public RegisterValidator()
        {
            RuleFor(x => x.Request.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Request.Password)
               .ApplyPasswordRules();

            RuleFor(x => x.Request.DisplayName)
                .NotEmpty()
                .MinimumLength(2)
                .MaximumLength(50);
        }
    }
}
