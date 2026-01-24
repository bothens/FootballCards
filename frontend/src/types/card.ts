export interface CardDto {
    cardId: number;
    playerId: number;
    playerName: string;
    playerPosition: string;
    price: number;
    sellingPrice?: number;
    ownerId?: number;
    status: string;
    cardType: string;
}

export interface CreateCardDto {
    playerId: number;
    price: number;
    cardType: string;
}