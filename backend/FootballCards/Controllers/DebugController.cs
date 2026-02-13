using Infrastructure_Layer.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FootballCards.API.Controllers
{
    [ApiController]
    [Route("api/debug")]
    [Authorize(Roles = "admin")]
    public class DebugController : ControllerBase
    {
        private readonly AppDbContext _db;

        public DebugController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("db-info")]
        public async Task<IActionResult> DbInfo()
        {
            var dbName = await _db.Database.ExecuteSqlRawAsync("SELECT 1");
            var conn = _db.Database.GetDbConnection();

            return Ok(new
            {
                DataSource = conn.DataSource,
                Database = conn.Database
            });
        }

        [HttpGet("user-count")]
        public async Task<IActionResult> UserCount()
        {
            // Byt DbSet-namn om ditt DbSet inte heter Users
            var count = await _db.Set<dynamic>().FromSqlRaw("SELECT * FROM dbo.[User]").CountAsync();
            return Ok(new { Count = count });
        }
    }
}
