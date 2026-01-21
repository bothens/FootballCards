using FluentValidation;

namespace Application_Layer.Features.Players.Commands.Create
{
    public sealed class CreatePlayerValidator : AbstractValidator<CreatePlayerCommand>
    {
        public CreatePlayerValidator()
        {
            RuleFor(x => x.Player.Name)
                .NotEmpty().WithMessage("Name is required")
                .MaximumLength(120).WithMessage("Name cannot exceed 120 characters");

            RuleFor(x => x.Player.Position)
                .NotEmpty().WithMessage("Position is required")
                .MaximumLength(40).WithMessage("Position cannot exceed 40 characters");

            RuleFor(x => x.Player.CurrentPrice)
                .GreaterThan(0).WithMessage("CurrentPrice must be greater than 0");
        }
    }
}
