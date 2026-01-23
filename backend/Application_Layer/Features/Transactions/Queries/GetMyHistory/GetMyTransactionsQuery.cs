using Application_Layer.Common.Models;
using Application_Layer.Features.Transactions.DTOs;
using MediatR;

namespace Application_Layer.Features.Transactions.Queries.GetMyHistory
{
    public sealed record GetMyTransactionsQuery(int UserId, string? Filter)
        : IRequest<OperationResult<List<TransactionDto>>>;
}
