using Application_Layer.Features.Cards.Commands.Issue;
using FluentValidation;

namespace Application_Layer.Features.Cards.Commands.Issue
{
    public sealed class IssueCardValidator : AbstractValidator<IssueCardCommand>
    {
        public IssueCardValidator()
        {
            RuleFor(x => x.Card.PlayerId)
                .NotEmpty().WithMessage("PlayerId is required");

            RuleFor(x => x.Card.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0");

            RuleFor(x => x.Card.CardType)
                .MaximumLength(20).WithMessage("CardType cannot exceed 20 characters");
        }
    }
}
