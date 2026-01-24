using Domain_Layer.Entities;
using Application_Layer.Common.Interfaces;
using Infrastructure_Layer.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure_Layer.Repositories.Implementations
{
    public sealed class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;

        public UserRepository(AppDbContext db)
        {
            _db = db;
        }

        public Task<User?> GetByIdAsync(int Userid, CancellationToken ct = default)
        {
            return _db.User.FirstOrDefaultAsync(x => x.UserId == Userid, ct);
        }

        public Task<User?> GetByUserIdAsync(int userId, CancellationToken ct = default)
            => _db.User.FirstOrDefaultAsync(x => x.UserId == userId, ct);

        public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
            => _db.User.FirstOrDefaultAsync(x => x.Email == email, ct);

        public async Task AddAsync(User user, CancellationToken ct = default)
        {
            await _db.User.AddAsync(user, ct);
            await _db.SaveChangesAsync(ct);
        }

        public Task SaveChangesAsync(CancellationToken ct = default)
            => _db.SaveChangesAsync(ct);

        public Task<bool> EmailExistsAsync(string email, CancellationToken ct = default)
            => _db.User.AnyAsync(x => x.Email == email, ct); 

        public async Task DeleteAsync(User user, CancellationToken ct = default)
        {
            _db.User.Remove(user);
            await _db.SaveChangesAsync(ct);
        }
        public async Task<User> UpdateAsync(User user, CancellationToken ct = default)
        {
            _db.User.Update(user);
            await _db.SaveChangesAsync(ct);
            return user;
        }
    }
}
