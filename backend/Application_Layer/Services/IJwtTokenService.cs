using Domain_Layer.Entities;


namespace Application_Layer.Services
{
    
    public interface IJwtTokenService
    {
        string CreateToken(User user);
    }
}
