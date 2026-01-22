namespace Application_Layer.Features.Cards.DTOs
{
    public sealed class CreateCardDto
    {
        public int PlayerId { get; set; }
        public string? CardType { get; set; }
        public decimal Price { get; set; }
    }
}
