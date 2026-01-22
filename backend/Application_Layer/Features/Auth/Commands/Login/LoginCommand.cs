<<<<<<< HEAD
﻿using Application_Layer.Common.Models;
using Application_Layer.Features.Auth.DTOs;
using MediatR;

namespace Application_Layer.Features.Auth.Commands.Login
{
    public sealed record LoginCommand(LoginRequestDto Request)
        : IRequest<OperationResult<UserProfileDto>>;
=======
﻿using Application_Layer.Common;
using Application_Layer.Common.Models;
using Application_Layer.Features.Auth.DTOs;
using MediatR;


namespace Application_Layer.Features.Auth.Commands.Login
{
    public class LoginCommand : IRequest<OperationResult<AuthResponseDto>>
    {
        public LoginRequestDto Request { get; }

        public LoginCommand(LoginRequestDto request)
        {
            Request = request;
        }
    }
>>>>>>> main
}
