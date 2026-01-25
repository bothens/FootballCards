import { API_BASE, apiFetch } from '../api/apiClient';
import type { CardDto } from '../types/dtos/card';


class PortfolioService {
private baseUrl = `${API_BASE}/api/portfolio/me`;

    async getMyPortfolio(search?: string, filter?: string, sort?: string): Promise<CardDto[]> {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (filter) params.append('filter', filter);
        if (sort) params.append('sort', sort);

        const url = params.toString() ? `${this.baseUrl}?${params.toString()}` : this.baseUrl;
        return apiFetch<CardDto[]>(url); 
    }
}

export default new PortfolioService();
