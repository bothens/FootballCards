import { apiFetch } from '../api/apiClient';
import type { CardDto, CreateCardDto } from '../types/card';

class CardService {
    private baseUrl = '/api/cards';

    // Skapa/issue nytt kort
    async issueCard(card: CreateCardDto): Promise<CardDto> {
        return apiFetch(`${this.baseUrl}/issue`, {
            method: 'POST',
            body: JSON.stringify(card),
        });
    }

    // Hämtar alla kort (om du vill implementera senare)
    async getAllCards(): Promise<CardDto[]> {
        return apiFetch(this.baseUrl);
    }
}

export default new CardService();
