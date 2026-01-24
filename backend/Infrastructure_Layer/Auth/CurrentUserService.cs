using System.Security.Claims;
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
                var id = user?.FindFirstValue(ClaimTypes.NameIdentifier);

                return int.TryParse(id, out var userId) ? userId : 0;
            }
        }
    }
}
