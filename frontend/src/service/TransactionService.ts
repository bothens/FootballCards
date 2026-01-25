import { apiFetch } from './apiClient';
import type { TransactionDto } from '../types/dtos/transaction';

class TransactionService {
    private baseUrl = '/api/transactions/transactions';

    // Hämta alla transaktioner för aktuell användare
    async getMyTransactions(filter?: string): Promise<TransactionDto[]> {
        const url = filter ? `${this.baseUrl}?filter=${encodeURIComponent(filter)}` : this.baseUrl;
        return apiFetch(url);
    }
}

export default new TransactionService();