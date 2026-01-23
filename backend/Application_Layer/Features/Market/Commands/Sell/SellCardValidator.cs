using FluentValidation;

namespace Application_Layer.Features.Market.Commands.Sell
{
    public sealed class SellCardValidator : AbstractValidator<SellCardCommand>
    {
        public SellCardValidator()
        {
            RuleFor(x => x.SellerId)
                .NotEmpty().WithMessage("SellerId is required");

            RuleFor(x => x.CardId)
                .GreaterThan(0).WithMessage("CardId must be greater than 0");

            RuleFor(x => x.SellingPrice)
                .GreaterThan(0).WithMessage("SellingPrice must be greater than 0");
        }
    }
}
