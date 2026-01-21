using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using Application_Layer.Features.Transactions.DTOs;
using MediatR;

namespace Application_Layer.Features.Transactions.Queries.GetMyHistory
{
    public sealed class GetMyTransactionsQueryHandler
        : IRequestHandler<GetMyTransactionsQuery, OperationResult<List<TransactionDto>>>
    {
        private readonly ICurrentUserService _currentUser;

        public GetMyTransactionsQueryHandler(ICurrentUserService currentUser)
        {
            _currentUser = currentUser;
        }

        public Task<OperationResult<List<TransactionDto>>> Handle(
            GetMyTransactionsQuery request,
            CancellationToken cancellationToken)
        {
            var list = new List<TransactionDto>();

            return Task.FromResult(OperationResult<List<TransactionDto>>.Ok(list));
        }
    }
}
