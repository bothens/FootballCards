using Application_Layer.Common.Models;
using Application_Layer.Features.Transactions.DTOs;
using Infrastructure_Layer.Repositories.Interfaces;
using MediatR;

namespace Application_Layer.Features.Transactions.Queries.GetMyHistory
{
    public sealed class GetMyTransactionsQueryHandler
        : IRequestHandler<GetMyTransactionsQuery, OperationResult<List<TransactionDto>>>
    {
        private readonly ITransactionRepository _transactionRepository;

        public GetMyTransactionsQueryHandler(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task<OperationResult<List<TransactionDto>>> Handle(
            GetMyTransactionsQuery request,
            CancellationToken cancellationToken)
        {
            try
            {
                // Hämta transaktioner från repository med optional filter
                var transactions = await _transactionRepository.GetByUserIdAsync(
                    request.UserId,
                    request.Filter,
                    cancellationToken);

                // Mappa entiteter till DTO
                var result = transactions.Select(t => new TransactionDto
                {
                    TransactionId = t.TransactionId,
                    CardId = t.CardId,
                    BuyerId = t.BuyerId,
                    SellerId = t.SellerId,
                    Price = t.Price,
                    Date = t.Date,
                    PlayerName = t.Card?.Player?.Name ?? string.Empty,
                    CardType = t.Card?.CardType ?? string.Empty
                }).ToList();

                return OperationResult<List<TransactionDto>>.Ok(result);
            }
            catch (Exception ex)
            {
                return OperationResult<List<TransactionDto>>.Fail(
                    ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
