using Application_Layer.Features.Cards.DTOs;

namespace Application_Layer.Features.Market.DTOs
{
    public sealed class OpenPackResultDto
    {
        public string PackType { get; set; } = string.Empty;
        public decimal PackPrice { get; set; }
        public decimal BalanceAfterOpen { get; set; }
        public CardDto Card { get; set; } = new();
    }
}
