export interface TransactionDto {
    transactionId: number;
    cardId: number;
    buyerId?: number;
    sellerId?: number;
    price: number;
    date: string; // ISO string
    playerName: string;
    cardType: string;
}
