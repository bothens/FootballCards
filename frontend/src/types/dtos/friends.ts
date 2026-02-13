export type FriendDto = {
  userId: number;
  displayName: string;
  email: string;
  imageUrl?: string | null;
};

export type FriendRequestDto = {
  friendRequestId: number;
  requesterId: number;
  addresseeId: number;
  requesterName: string;
  addresseeName: string;
  requesterImageUrl?: string | null;
  addresseeImageUrl?: string | null;
  status: "Pending" | "Accepted" | "Rejected" | string;
  createdAt: string;
};

export type FriendRequestCreateDto = {
  targetUserId: number;
};

export type FriendRequestActionDto = {
  friendRequestId: number;
};
