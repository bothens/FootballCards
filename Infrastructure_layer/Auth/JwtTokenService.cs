using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application_Layer.Services;
using Domain_Layer.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure_layer.Auth
{
    // Kommentar: Skapar JWT token.
    public sealed class JwtTokenService : IJwtTokenService
    {
        private readonly IConfiguration _config;

        public JwtTokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken(User user)
        {
            var key = _config["Jwt:Key"] ?? throw new Exception("Jwt:Key saknas i appsettings.json");
            var issuer = _config["Jwt:Issuer"] ?? "FootballCardsApi";
            var audience = _config["Jwt:Audience"] ?? "FootballCardsClient";

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.DisplayName)
            };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
