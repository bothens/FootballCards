using Application_Layer.Common.Models;
using Application_Layer.Features.Messages.DTOs;
using MediatR;

namespace Application_Layer.Features.Messages.Queries.GetConversation
{
    public sealed record GetConversationQuery(int UserId, int FriendId)
        : IRequest<OperationResult<List<MessageDto>>>;
}
