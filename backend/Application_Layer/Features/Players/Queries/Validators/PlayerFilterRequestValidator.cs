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
        }
    }
}
