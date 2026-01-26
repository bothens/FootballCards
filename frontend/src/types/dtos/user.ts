export interface UserDto {
    userId: number;
    email: string;
    displayName?: string;
    createdAt: string;
}

export interface ChangePasswordRequestDto {
    oldPassword: string;
    newPassword: string;
}