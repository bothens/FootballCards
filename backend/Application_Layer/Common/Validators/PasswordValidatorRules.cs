using FluentValidation;

namespace Application_Layer.Common.Validators
{
    public static class PasswordValidatorRules
    {
        public static IRuleBuilderOptions<T, string> ApplyPasswordRules<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            return ruleBuilder
                .NotEmpty()
                .WithMessage("Password is required.")
                .MinimumLength(8)
                .WithMessage("Password must be at least 8 characters long.")
                .Matches(@"[A-Z]")
                .WithMessage("Password must contain at least one uppercase letter.")
                .Matches(@"[a-z]")
                .WithMessage("Password must contain at least one lowercase letter.")
                .Matches(@"\d")
                .WithMessage("Password must contain at least one digit.")
                .Matches(@"[\!\?\*\.\@\#\$\%\^\&\+\=]")
                .WithMessage("Password must contain at least one special character (!?*.@#$%^&+=)");
        }
    }
}