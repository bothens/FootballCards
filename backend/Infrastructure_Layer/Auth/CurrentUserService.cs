using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Application_Layer.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure_Layer.Auth
{
    public sealed class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _http;

        public CurrentUserService(IHttpContextAccessor http)
        {
            _http = http;
        }

        public int UserId
        {
            get
            {
                var user = _http.HttpContext?.User;
                var id = user?.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? user?.FindFirstValue(JwtRegisteredClaimNames.Sub);

                return int.TryParse(id, out var userId) ? userId : 0;
            }
        }
    }
}
