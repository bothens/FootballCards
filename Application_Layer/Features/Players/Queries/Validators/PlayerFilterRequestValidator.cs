using Application_Layer.Features.Players.DTOs;
using FluentValidation;

namespace Application_Layer.Features.Players.Validators
{
    public sealed class PlayerFilterRequestValidator : AbstractValidator<PlayerFilterRequestDto>
    {
        public PlayerFilterRequestValidator()
        {
            RuleFor(x => x.Team)
                .MaximumLength(80);

            RuleFor(x => x.Position)
                .MaximumLength(40);

            RuleFor(x => x.MinPrice)
                .GreaterThanOrEqualTo(0)
                .When(x => x.MinPrice.HasValue);

            RuleFor(x => x.MaxPrice)
                .GreaterThanOrEqualTo(0)
                .When(x => x.MaxPrice.HasValue);

            RuleFor(x => x)
                .Must(x => !x.MinPrice.HasValue || !x.MaxPrice.HasValue || x.MinPrice <= x.MaxPrice)
                .WithMessage("MinPrice must be less than or equal to MaxPrice.");
        }
    }
}
