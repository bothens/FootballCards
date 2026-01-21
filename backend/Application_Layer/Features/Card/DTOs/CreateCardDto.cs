namespace Application_Layer.Features.Cards.DTOs
{
    public sealed class CreateCardDto
    {
        public int PlayerId { get; set; }
        public string? Status { get; set; }
        public string? CardType { get; set; }
    }
}
