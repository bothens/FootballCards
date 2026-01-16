using FluentValidation;

namespace Application_Layer.Features.Auth.Commands.Login
{
    public sealed class LoginValidator : AbstractValidator<LoginCommand>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Request.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Request.Password)
                .NotEmpty()
                .MinimumLength(6);
        }
    }
}
