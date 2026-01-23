using Application_Layer.Common.Interfaces;
using Application_Layer.Common.Models;
using MediatR;

namespace Application_Layer.Features.Users.Commands.DeleteMy
{
    public sealed class DeleteMyProfileCommandHandler
        : IRequestHandler<DeleteMyProfileCommand, OperationResult<bool>>
    {
        private readonly IUserRepository _userRepository;
        private readonly ICardRepository _cardRepository;
        private readonly ITransactionRepository _transactionRepository;

        public DeleteMyProfileCommandHandler(
            IUserRepository userRepository,
            ICardRepository cardRepository,
            ITransactionRepository transactionRepository)
        {
            _userRepository = userRepository;
            _cardRepository = cardRepository;
            _transactionRepository = transactionRepository;
        }

        public async Task<OperationResult<bool>> Handle(
            DeleteMyProfileCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                var user = await _userRepository.GetByUserIdAsync(request.UserId, cancellationToken);
                if (user == null)
                    return OperationResult<bool>.Fail("User not found");

                var userCards = await _cardRepository.GetCardsAsync(userId: request.UserId, ct: cancellationToken);
                foreach (var card in userCards)
                {
                    card.OwnerId = null;
                    await _cardRepository.UpdateAsync(card, cancellationToken);
                }

                var transactions = await _transactionRepository.GetByUserIdAsync(request.UserId, ct: cancellationToken);
                foreach (var t in transactions)
                {
                    if (t.BuyerId == request.UserId) t.BuyerId = null;
                    if (t.SellerId == request.UserId) t.SellerId = null;
                    await _transactionRepository.UpdateAsync(t, cancellationToken);
                }

                await _userRepository.DeleteAsync(user, cancellationToken);

                return OperationResult<bool>.Ok(true);
            }
            catch (Exception ex)
            {
                return OperationResult<bool>.Fail(ex.InnerException?.Message ?? ex.Message);
            }
        }
    }
}
