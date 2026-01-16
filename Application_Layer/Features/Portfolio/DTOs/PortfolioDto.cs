namespace Application_Layer.Features.Portfolio.DTOs
{
    public sealed class PortfolioDto
    {
        public Guid UserId { get; init; }
        public decimal TotalValue { get; init; }
        public IReadOnlyList<PortfolioItemDto> Items { get; init; } = [];
    }
}
