using FluentValidation;

namespace Application_Layer.Features.Trade.Commands.Sell
{
    public sealed class SellValidator : AbstractValidator<SellCommand>
    {
        public SellValidator()
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
