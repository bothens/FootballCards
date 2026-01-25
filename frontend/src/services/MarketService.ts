import { API_BASE, apiFetch,  } from '../api/apiClient';
import type { MarketCardDto, SellCardRequestDto, PurchaseCardRequestDto } from '../types/dtos/market';
import type { QueryParams } from '../types/ui/types';


class MarketService {
    private baseUrl = `${API_BASE}/api/market`;

    // Hämta marknadens kort
    async getMarketCards(params: QueryParams): Promise<MarketCardDto[]> {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.append('search', params.search);
        if (params.filter) searchParams.append('filter', params.filter);
        if (params.sort) searchParams.append('sort', params.sort);

        const url = searchParams.toString() ? `${this.baseUrl}?${searchParams.toString()}` : this.baseUrl;
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
