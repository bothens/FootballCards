using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application_Layer.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure_Layer.Auth
{
    public sealed class JwtTokenService : IJwtTokenService
    {
        private readonly IConfiguration _config;

        public JwtTokenService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(Guid userId, string email)
        {
            var secret = _config["Jwt:Secret"] ?? "PLEASE_CHANGE_ME";
            var issuer = _config["Jwt:Issuer"] ?? "FootballCards";
            var audience = _config["Jwt:Audience"] ?? "FootballCards";
            var minutes = int.TryParse(_config["Jwt:ExpiryMinutes"], out var m) ? m : 60;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new(JwtRegisteredClaimNames.Email, email),
                new(ClaimTypes.NameIdentifier, userId.ToString()),
                new(ClaimTypes.Email, email)
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(minutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
