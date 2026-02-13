export type TradeOfferDto = {
  tradeOfferId: number;
  fromUserId: number;
  toUserId: number;
  fromUserName: string;
  toUserName: string;
  cardId: number;
  cardPlayerName: string;
  cardImageUrl: string;
  price?: number | null;
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled" | string;
  createdAt: string;
};

export type CreateTradeOfferDto = {
  toUserId: number;
  cardId: number;
  price?: number | null;
};

export type TradeOfferActionDto = {
  tradeOfferId: number;
};
