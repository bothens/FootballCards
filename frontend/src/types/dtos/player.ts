export interface PlayerDto {
    id: number;
    name: string;
    team: string;
    position: string;
    imageUrl: string;
}

export interface CreatePlayerRequestDto {
    name: string;
    position: string;
    imageUrl?: string;
    team?: string;
}
