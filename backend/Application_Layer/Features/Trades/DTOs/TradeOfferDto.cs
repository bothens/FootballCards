using Domain_Layer.Enums;

namespace Application_Layer.Features.Trades.DTOs
{
    public sealed class TradeOfferDto
    {
        public int TradeOfferId { get; set; }
        public int FromUserId { get; set; }
        public int ToUserId { get; set; }
        public string FromUserName { get; set; } = string.Empty;
        public string ToUserName { get; set; } = string.Empty;
        public int CardId { get; set; }
        public string CardPlayerName { get; set; } = string.Empty;
        public string CardImageUrl { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public string Status { get; set; } = TradeOfferStatus.Pending.ToString();
        public DateTime CreatedAt { get; set; }
    }
}
