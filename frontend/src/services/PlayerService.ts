import { API_BASE, apiFetch } from '../api/apiClient';
import type { PlayerDto, CreatePlayerRequestDto } from '../types/player';

class PlayerService {
    private baseUrl = `${API_BASE}/api/players`;

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
