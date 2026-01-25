import { apiFetch } from './apiClient';
import type { PlayerDto, CreatePlayerRequestDto } from '../types/dtos/player';

class PlayerService {
    private baseUrl = '/api/players';

    // Hämta alla spelare
    async getAll(): Promise<PlayerDto[]> {
        return apiFetch(this.baseUrl);
    }

    // Skapa ny spelare
    async create(request: CreatePlayerRequestDto): Promise<PlayerDto> {
        return apiFetch(this.baseUrl, {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }
}

export default new PlayerService();
