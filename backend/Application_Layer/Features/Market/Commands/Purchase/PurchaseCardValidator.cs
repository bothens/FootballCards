using FluentValidation;

namespace Application_Layer.Features.Market.Commands.Purchase
{
    public sealed class PurchaseCardValidator : AbstractValidator<PurchaseCardCommand>
    {
        public PurchaseCardValidator()
        {
            RuleFor(x => x.BuyerId)
                .NotEmpty().WithMessage("BuyerId is required");

            RuleFor(x => x.CardId)
                .GreaterThan(0).WithMessage("CardId must be greater than 0");
        }
    }
}
