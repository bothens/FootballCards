export interface PlayerDto {
    id: number;
    name: string;
    team: string;
    position: string;
}

export interface CreatePlayerRequestDto {
    name: string;
    position: string;
}
