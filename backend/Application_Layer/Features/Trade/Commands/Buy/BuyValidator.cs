using FluentValidation;

namespace Application_Layer.Features.Trade.Commands.Buy
{
    public sealed class BuyValidator : AbstractValidator<BuyCommand>
    {
        public BuyValidator()
        {
            RuleFor(x => x.Request.PlayerId)
                .GreaterThan(0);

            RuleFor(x => x.Request.Quantity)
                .GreaterThan(0);

            RuleFor(x => x.Request.Price)
                .GreaterThan(0);
        }
    }
}
