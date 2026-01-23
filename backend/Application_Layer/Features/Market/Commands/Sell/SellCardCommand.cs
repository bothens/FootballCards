using Application_Layer.Features.Cards.DTOs;
using Application_Layer.Common.Models;
using MediatR;

namespace Application_Layer.Features.Market.Commands.Sell
{
    public sealed record SellCardCommand(int SellerId, int CardId, decimal SellingPrice)
        : IRequest<OperationResult<CardDto>>;
}