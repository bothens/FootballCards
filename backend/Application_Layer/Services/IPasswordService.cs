namespace Application_Layer.Services
{
   
    public interface IPasswordService
    {
        string Hash(string password);
        bool Verify(string hashedPassword, string providedPassword);
    }
}
