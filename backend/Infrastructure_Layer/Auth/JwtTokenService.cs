using Application_Layer.Services;
using Domain_Layer.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure_Layer.Auth
{
    public sealed class JwtTokenService : IJwtTokenService
    {
        private readonly IConfiguration _config;

        public JwtTokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken(User user)
        {
            var secret = _config["Jwt:Secret"];
            if (string.IsNullOrWhiteSpace(secret))
                throw new InvalidOperationException("Jwt:Secret saknas i appsettings.json");

            var issuer = _config["Jwt:Issuer"];
            if (string.IsNullOrWhiteSpace(issuer))
                throw new InvalidOperationException("Jwt:Issuer saknas i appsettings.json");

            var audience = _config["Jwt:Audience"];
            if (string.IsNullOrWhiteSpace(audience))
                throw new InvalidOperationException("Jwt:Audience saknas i appsettings.json");

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("displayName", user.DisplayName)
            };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(4),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
