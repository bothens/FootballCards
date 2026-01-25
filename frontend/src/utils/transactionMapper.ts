import type { TransactionDto } from '../types/transaction';
import type { Transaction } from '../types/types';

export const mapDtoToTransaction = (dto: TransactionDto): Transaction => {
  return {
    id: dto.transactionId,
    type: dto.buyerId ? 'BUY' : 'SELL',
    playerName: dto.playerName,
    cardType: dto.cardType,
    amount: dto.price,
    timestamp: dto.date,
  };
};

export const mapDtosToTransactions = (dtos: TransactionDto[]): Transaction[] => {
  return dtos.map(mapDtoToTransaction);
};
