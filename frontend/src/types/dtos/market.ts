export interface MarketCardDto {
    cardId: number;
    playerId: number;
    playerName: string;
    playerTeam?: string | null;
    playerPosition: string;
    playerImageUrl: string;
    cardImageUrl?: string | null;
    facts?: string | null;
    factsEn?: string | null;
    sellingPrice: number;
    highestBid?: number | null;
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

export interface BidCardRequestDto {
    cardId: number;
    bidAmount: number;
}

export interface BidResultDto {
    cardId: number;
    highestBid: number;
}

export interface OpenPackRequestDto {
    packType: 'starter' | 'premium' | 'elite';
}

export interface OpenPackResultDto {
    packType: string;
    packPrice: number;
    balanceAfterOpen: number;
    card: {
        cardId: number;
        playerId: number;
        playerName: string;
        playerTeam?: string | null;
        playerPosition: string;
        playerImageUrl: string;
        cardImageUrl?: string | null;
        facts?: string | null;
        factsEn?: string | null;
        price: number;
        sellingPrice?: number | null;
        ownerId?: number | null;
        status: string;
        cardType: string;
    };
}
