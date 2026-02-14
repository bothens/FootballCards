export interface CardDto {
    cardId: number;
    playerId: number;
    playerName: string;
    playerTeam?: string | null;
    playerPosition: string;
    playerImageUrl: string;
    cardImageUrl?: string | null;
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
    imageUrl?: string;
}
