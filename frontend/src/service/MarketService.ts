import { apiFetch } from './apiClient';
import type { MarketCardDto, SellCardRequestDto, PurchaseCardRequestDto } from '../types/dtos/market';

class MarketService {
    private baseUrl = '/api/market';

    // Hämta marknadens kort
    async getMarketCards(search?: string, filter?: string, sort?: string): Promise<MarketCardDto[]> {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (filter) params.append('filter', filter);
        if (sort) params.append('sort', sort);

        const url = params.toString() ? `${this.baseUrl}?${params.toString()}` : this.baseUrl;
        return apiFetch(url);
    }

    // Köp kort
    async purchaseCard(request: PurchaseCardRequestDto): Promise<MarketCardDto> {
        return apiFetch(`${this.baseUrl}/purchase`, {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // Sälj kort
    async sellCard(request: SellCardRequestDto): Promise<MarketCardDto> {
        return apiFetch(`${this.baseUrl}/sell`, {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }
}

export default new MarketService();
