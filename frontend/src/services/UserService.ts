import { API_BASE, apiFetch } from '../api/apiClient';
import type { UserDto, ChangePasswordRequestDto } from '../types/dtos/user';

class UserService {
    private baseUrl = `${API_BASE}/api/users/me`;

    // Hämta användarprofil
    async getProfile(): Promise<UserDto> {
        return apiFetch(this.baseUrl);
    }

    // Radera användarprofil
    async deleteProfile(): Promise<{ success: boolean; message?: string }> {
        return apiFetch(this.baseUrl, { method: 'DELETE' });
    }

    // Byt lösenord
    async changePassword(dto: ChangePasswordRequestDto): Promise<boolean> {
        const res = await apiFetch(`${this.baseUrl}/password`, {
            method: 'PUT',
            body: JSON.stringify(dto),
        });
        return res.data; // true/false
    }
}

export default new UserService();
