export type MessageDto = {
  messageId: number;
  senderId: number;
  receiverId: number;
  body: string;
  createdAt: string;
  readAt?: string | null;
};

export type MessageThreadDto = {
  friendId: number;
  friendName: string;
  friendImageUrl?: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

export type SendMessageRequestDto = {
  toUserId: number;
  body: string;
};
