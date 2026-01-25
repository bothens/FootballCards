import { API_BASE, apiFetch } from '../api/apiClient';
import type { TransactionDto } from '../types/transaction';

class TransactionService {
    private baseUrl = `${API_BASE}/api/transactions/transactions`;

    // Hämta alla transaktioner för aktuell användare
    async getMyTransactions(filter?: string): Promise<TransactionDto[]> {
        const url = filter ? `${this.baseUrl}?filter=${encodeURIComponent(filter)}` : this.baseUrl;
        return apiFetch(url);
    }
}

export default new TransactionService();