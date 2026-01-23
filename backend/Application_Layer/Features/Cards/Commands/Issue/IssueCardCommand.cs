using Application_Layer.Common.Models;
using Application_Layer.Features.Cards.DTOs;
using MediatR;

namespace Application_Layer.Features.Cards.Commands.Issue
{
    public sealed record IssueCardCommand(CreateCardDto Card)
        : IRequest<OperationResult<CardDto>>;
}
