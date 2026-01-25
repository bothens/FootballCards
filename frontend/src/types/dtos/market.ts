export interface MarketCardDto {
    cardId: number;
    playerId: number;
    playerName: string;
    playerPosition: string;
    sellingPrice: number;
    status: string;
    cardType: string;
}

export interface SellCardRequestDto {
    cardId: number;
    sellingPrice: number;
}

export interface PurchaseCardRequestDto {
    cardId: number;
}
