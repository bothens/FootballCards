namespace Application_Layer.Common.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(Guid userId, string email);
    }
}
