using FluentValidation;

namespace Application_Layer.Features.Market.Commands.OpenPack
{
    public sealed class OpenPackValidator : AbstractValidator<OpenPackCommand>
    {
        public OpenPackValidator()
        {
            RuleFor(x => x.UserId).GreaterThan(0);
            RuleFor(x => x.PackType).NotEmpty().MaximumLength(20);
        }
    }
}
