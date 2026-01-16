using FluentValidation;

namespace Application_Layer.Features.Trade.Commands.Bulk
{
    public sealed class BulkTradeValidator : AbstractValidator<BulkTradeCommand>
    {
        public BulkTradeValidator()
        {
            RuleFor(x => x.Request.Trades)
                .NotEmpty();

            RuleForEach(x => x.Request.Trades).ChildRules(trade =>
            {
                trade.RuleFor(t => t.PlayerId).GreaterThan(0);
                trade.RuleFor(t => t.Quantity).GreaterThan(0);
                trade.RuleFor(t => t.Price).GreaterThan(0);
            });
        }
    }
}
