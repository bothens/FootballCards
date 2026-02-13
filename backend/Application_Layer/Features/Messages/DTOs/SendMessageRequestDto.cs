namespace Application_Layer.Features.Messages.DTOs
{
    public sealed class SendMessageRequestDto
    {
        public int ToUserId { get; set; }
        public string Body { get; set; } = string.Empty;
    }
}
