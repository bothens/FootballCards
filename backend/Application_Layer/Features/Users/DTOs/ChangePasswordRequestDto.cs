namespace Application_Layer.Features.Users.DTOs
{
    public sealed class ChangePasswordRequestDto
    {
        public string OldPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }

}
