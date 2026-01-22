using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
using MediatR;

namespace Application_Layer.Features.Market.Commands.Purchase
{
    public sealed record PurchaseCardCommand(
        int BuyerId,
        int CardId)
        : IRequest<OperationResult<CardDto>>;
}
