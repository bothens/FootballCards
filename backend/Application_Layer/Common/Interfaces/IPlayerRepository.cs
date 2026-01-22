using Domain_Layer.Entities;

namespace Infrastructure_Layer.Repositories.Interfaces
{
    public interface IPlayerRepository
    {
        Task<List<Player>> GetAllAsync(CancellationToken ct = default);
        Task<Player?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<List<Player>> FilterAsync(string? team, string? position, decimal? minPrice, decimal? maxPrice, CancellationToken ct = default);
        Task UpdateAsync(Player player, CancellationToken ct = default);
        Task AddAsync(Player player, CancellationToken ct = default);
    }
}
