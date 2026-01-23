namespace Application_Layer.Features.Market.DTOs
{
    public sealed class SellCardRequestDto
    {
        public int CardId { get; set; }
        public decimal SellingPrice { get; set; }
    }
}
