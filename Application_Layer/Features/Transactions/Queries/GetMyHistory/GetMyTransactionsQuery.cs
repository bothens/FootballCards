using Application_Layer.Common.Models;
using Application_Layer.Features.Transactions.DTOs;
using MediatR;

namespace Application_Layer.Features.Transactions.Queries.GetMyHistory
{
    public sealed record GetMyTransactionsQuery()
        : IRequest<OperationResult<List<TransactionDto>>>;
}
