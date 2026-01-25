import { API_BASE, apiFetch } from '../api/apiClient';
import type { TransactionDto } from '../types/dtos/transaction';

class TransactionService {
    private baseUrl = `${API_BASE}/api/transactions/transactions`;

  async getMyTransactions(filter?: 'BUY' | 'SELL'): Promise<TransactionDto[]> {
    const query = filter ? `?filter=${filter.toLowerCase()}` : '';
    return apiFetch(`${this.baseUrl}${query}`);
    }
}

export default new TransactionService();