import { API_BASE, apiFetch } from "../api/apiClient";
import type { CreateTradeOfferDto, TradeOfferActionDto, TradeOfferDto } from "../types/dtos/trades";

class TradesService {
  private baseUrl = `${API_BASE}/api/trades`;

  async getIncoming(): Promise<TradeOfferDto[]> {
    return apiFetch(`${this.baseUrl}/incoming`);
  }

  async getOutgoing(): Promise<TradeOfferDto[]> {
    return apiFetch(`${this.baseUrl}/outgoing`);
  }

  async createOffer(payload: CreateTradeOfferDto): Promise<TradeOfferDto> {
    return apiFetch(`${this.baseUrl}/offer`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async acceptOffer(payload: TradeOfferActionDto): Promise<TradeOfferDto> {
    return apiFetch(`${this.baseUrl}/accept`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async rejectOffer(payload: TradeOfferActionDto): Promise<TradeOfferDto> {
    return apiFetch(`${this.baseUrl}/reject`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export default new TradesService();
