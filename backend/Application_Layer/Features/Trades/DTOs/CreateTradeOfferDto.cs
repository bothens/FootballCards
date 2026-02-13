namespace Application_Layer.Features.Trades.DTOs
{
    public sealed class CreateTradeOfferDto
    {
        public int ToUserId { get; set; }
        public int CardId { get; set; }
        public decimal? Price { get; set; }
    }
}
