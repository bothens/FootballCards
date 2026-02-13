namespace Application_Layer.Features.Market.DTOs
{
    public sealed class BidCardRequestDto
    {
        public int CardId { get; set; }
        public decimal BidAmount { get; set; }
    }
}
