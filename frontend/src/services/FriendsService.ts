import { API_BASE, apiFetch } from "../api/apiClient";
import type {
  FriendDto,
  FriendRequestDto,
  FriendRequestCreateDto,
  FriendRequestActionDto,
} from "../types/dtos/friends";

class FriendsService {
  private baseUrl = `${API_BASE}/api/friends`;

  async getFriends(): Promise<FriendDto[]> {
    return apiFetch(this.baseUrl);
  }

  async getRequests(): Promise<FriendRequestDto[]> {
    return apiFetch(`${this.baseUrl}/requests`);
  }

  async requestFriend(payload: FriendRequestCreateDto): Promise<FriendRequestDto> {
    return apiFetch(`${this.baseUrl}/request`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async acceptRequest(payload: FriendRequestActionDto): Promise<FriendRequestDto> {
    return apiFetch(`${this.baseUrl}/accept`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async rejectRequest(payload: FriendRequestActionDto): Promise<FriendRequestDto> {
    return apiFetch(`${this.baseUrl}/reject`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export default new FriendsService();
