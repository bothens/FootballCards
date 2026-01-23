using Domain_Layer.Entities;

namespace Application_Layer.Common.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByUserIdAsync(int UserId, CancellationToken ct = default);
        Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
        Task AddAsync(User user, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
        Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
        Task DeleteAsync(User user, CancellationToken ct = default);
    }
}
