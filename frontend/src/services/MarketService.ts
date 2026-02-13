import { API_BASE, apiFetch,  } from '../api/apiClient';
import type { SellCardRequestDto, PurchaseCardRequestDto, BidCardRequestDto, BidResultDto, MarketCardDto } from '../types/dtos/market';
import type { CardDto } from '../types/dtos/card';
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
    async purchaseCard(request: PurchaseCardRequestDto): Promise<CardDto> {
        return apiFetch(`${this.baseUrl}/purchase`, {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // Sälj kort
    async sellCard(request: SellCardRequestDto): Promise<CardDto> {
        return apiFetch(`${this.baseUrl}/sell`, {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // LÃ¤gg bud
    async bidCard(request: BidCardRequestDto): Promise<BidResultDto> {
        return apiFetch(`${this.baseUrl}/bid`, {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }
}

export default new MarketService();
