//using Domain_Layer.Entities;

<<<<<<< HEAD
namespace Application_Layer.Common.Interfaces
{
    public interface IPortfolioRepository
    {
        Task<Portfolio?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task<Portfolio> GetOrCreateByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
=======
//namespace Infrastructure_Layer.Repositories.Interfaces
//{
//    public interface IPortfolioRepository
//    {
//        Task<Portfolio?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
//        Task<Portfolio> GetOrCreateByUserIdAsync(Guid userId, CancellationToken ct = default);
//        Task SaveChangesAsync(CancellationToken ct = default);
//    }
//}
>>>>>>> f6f5177 (Implemented GetMyProfile endpoint with hardcoded UserId for testing  (JWT commented out))
