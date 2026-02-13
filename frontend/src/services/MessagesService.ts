import { API_BASE, apiFetch } from "../api/apiClient";
import type { MessageDto, MessageThreadDto, SendMessageRequestDto } from "../types/dtos/messages";

class MessagesService {
  private baseUrl = `${API_BASE}/api/messages`;

  async getThreads(): Promise<MessageThreadDto[]> {
    return apiFetch(`${this.baseUrl}/threads`);
  }

  async getConversation(friendId: number): Promise<MessageDto[]> {
    return apiFetch(`${this.baseUrl}/with/${friendId}`);
  }

  async sendMessage(payload: SendMessageRequestDto): Promise<MessageDto> {
    return apiFetch(this.baseUrl, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async markRead(friendId: number): Promise<number> {
    return apiFetch(`${this.baseUrl}/read/${friendId}`, {
      method: "POST",
    });
  }
}

export default new MessagesService();
