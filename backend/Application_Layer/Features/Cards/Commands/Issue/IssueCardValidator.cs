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

            RuleFor(x => x.Card.Facts)
                .NotEmpty()
                .When(x =>
                    x.Card.CardType != null &&
                    (x.Card.CardType.Equals("Skiller", StringComparison.OrdinalIgnoreCase) ||
                     x.Card.CardType.Equals("Historical Moment", StringComparison.OrdinalIgnoreCase)))
                .WithMessage("Facts is required for Skiller and Historical Moment cards");

            RuleFor(x => x.Card.FactsEn)
                .NotEmpty()
                .When(x =>
                    x.Card.CardType != null &&
                    (x.Card.CardType.Equals("Skiller", StringComparison.OrdinalIgnoreCase) ||
                     x.Card.CardType.Equals("Historical Moment", StringComparison.OrdinalIgnoreCase)))
                .WithMessage("FactsEn is required for Skiller and Historical Moment cards");
        }
    }
}
