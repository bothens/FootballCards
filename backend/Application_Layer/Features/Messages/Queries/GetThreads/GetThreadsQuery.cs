using Application_Layer.Common.Models;
using Application_Layer.Features.Messages.DTOs;
using MediatR;

namespace Application_Layer.Features.Messages.Queries.GetThreads
{
    public sealed record GetThreadsQuery(int UserId)
        : IRequest<OperationResult<List<MessageThreadDto>>>;
}
