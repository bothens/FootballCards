using Application_Layer.Common.Models;
using Application_Layer.Features.Messages.DTOs;
using MediatR;

namespace Application_Layer.Features.Messages.Commands.SendMessage
{
    public sealed record SendMessageCommand(int SenderId, int ReceiverId, string Body)
        : IRequest<OperationResult<MessageDto>>;
}
