import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";
import FriendsService from "../services/FriendsService";
import MessagesService from "../services/MessagesService";
import PortfolioService from "../services/PortfolioService";
import TradesService from "../services/TradesService";
import type { FriendDto } from "../types/dtos/friends";
import type { MessageDto, MessageThreadDto } from "../types/dtos/messages";

export const FriendsChat: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useI18n();
  const { friendId } = useParams();

  const [friends, setFriends] = useState<FriendDto[]>([]);
  const [threads, setThreads] = useState<MessageThreadDto[]>([]);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [messageBody, setMessageBody] = useState("");
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerCardId, setOfferCardId] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [myCards, setMyCards] = useState<{ cardId: number; playerName: string }[]>([]);

  const myUserId = user?.id ? Number(user.id) : 0;
  const friendIdNumber = friendId ? Number(friendId) : 0;

  const selectedFriend = useMemo(() => {
    if (!friendIdNumber) return null;
    return friends.find((friend) => friend.userId === friendIdNumber) ?? null;
  }, [friends, friendIdNumber]);

  const threadLookup = useMemo(
    () => new Map(threads.map((t) => [t.friendId, t])),
    [threads]
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const [friendsRes, threadsRes, portfolio] = await Promise.all([
          FriendsService.getFriends(),
          MessagesService.getThreads(),
          PortfolioService.getMyPortfolio(),
        ]);
        setFriends(friendsRes);
        setThreads(threadsRes);
        setMyCards(
          portfolio.map((card) => ({
            cardId: card.cardId,
            playerName: card.playerName,
          }))
        );
      } catch {
        // silent
      }
    };
    void load();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!selectedFriend) return;
    const loadConversation = async () => {
      try {
        const data = await MessagesService.getConversation(selectedFriend.userId);
        setMessages(data);
        await MessagesService.markRead(selectedFriend.userId);
        const updatedThreads = await MessagesService.getThreads();
        setThreads(updatedThreads);
      } catch {
        // silent
      }
    };
    void loadConversation();
  }, [selectedFriend]);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const sendMessage = async () => {
    if (!selectedFriend) return;
    const body = messageBody.trim();
    if (!body) return;

    try {
      await MessagesService.sendMessage({
        toUserId: selectedFriend.userId,
        body,
      });
      setMessageBody("");
      const updated = await MessagesService.getConversation(selectedFriend.userId);
      setMessages(updated);
      const updatedThreads = await MessagesService.getThreads();
      setThreads(updatedThreads);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not send message";
      alert(message);
    }
  };

  const openOffer = () => {
    if (!selectedFriend) return;
    setOfferCardId("");
    setOfferPrice("");
    setOfferOpen(true);
  };

  const submitOffer = async () => {
    if (!selectedFriend || !offerCardId) return;
    const normalized = offerPrice.replace(/[, ]/g, "");
    const price = normalized ? Number(normalized) : undefined;
    if (price !== undefined && (!Number.isFinite(price) || price < 0)) {
      alert("Invalid price");
      return;
    }
    try {
      await TradesService.createOffer({
        toUserId: selectedFriend.userId,
        cardId: Number(offerCardId),
        price: price ?? null,
      });
      setOfferOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not create offer";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <div>
            <h1 className="text-2xl font-black">{t("chatTitle")}</h1>
            <p className="text-zinc-400 text-sm">
              {selectedFriend ? selectedFriend.displayName : t("selectFriendToChat")}
            </p>
          </div>
          <Link
            to="/friends"
            className="h-10 px-4 rounded-xl bg-zinc-800 text-zinc-200 text-[10px] font-black uppercase tracking-widest flex items-center justify-center"
          >
            {t("backToFriends")}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{t("yourFriendsLabel")}</div>
            {friends.length === 0 && (
              <div className="text-xs text-zinc-500">{t("noFriends")}</div>
            )}
            {friends.map((friend) => {
              const thread = threadLookup.get(friend.userId);
              return (
                <Link
                  key={friend.userId}
                  to={`/friends/chat/${friend.userId}`}
                  className={`block rounded-xl border px-3 py-2 transition-colors ${
                    selectedFriend?.userId === friend.userId
                      ? "border-emerald-500/60 bg-emerald-500/10"
                      : "border-zinc-800 bg-black/40 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold">{friend.displayName}</div>
                    {thread?.unreadCount ? (
                      <span className="text-[10px] font-black uppercase text-emerald-400">
                        {thread.unreadCount} {t("newLabel")}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    {thread?.lastMessage || t("noMessages")}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t("chatTitle")}</h2>
                <p className="text-zinc-500 text-xs">
                  {selectedFriend ? selectedFriend.displayName : t("selectFriendToChat")}
                </p>
              </div>
              <button
                type="button"
                onClick={openOffer}
                disabled={!selectedFriend}
                className="h-9 px-4 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {t("offerTrade")}
              </button>
            </div>

            <div className="h-80 overflow-y-auto rounded-xl border border-zinc-800 bg-black/40 p-3 space-y-2">
              {messages.length === 0 && (
                <div className="text-xs text-zinc-500">{t("noMessages")}</div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.messageId}
                  className={`max-w-[70%] rounded-xl px-3 py-2 text-sm ${
                    msg.senderId === myUserId
                      ? "ml-auto bg-emerald-500/20 text-emerald-100 border border-emerald-500/30"
                      : "bg-black/60 text-zinc-200 border border-zinc-800"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {msg.body}
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-3">
              <input
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder={t("writeMessage")}
                className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!selectedFriend}
                className="h-12 px-5 rounded-xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest disabled:opacity-50"
              >
                {t("sendLabel")}
              </button>
            </div>
          </div>
        </div>

        {offerOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black">{t("createOffer")}</h3>
                  <p className="text-xs text-zinc-500">{selectedFriend?.displayName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOfferOpen(false)}
                  className="text-[10px] uppercase tracking-widest font-black text-zinc-400 hover:text-white"
                >
                  {t("close")}
                </button>
              </div>

              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                {t("cardLabel")}
              </label>
              <select
                value={offerCardId}
                onChange={(e) => setOfferCardId(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm mb-4"
              >
                <option value="">{t("selectCard")}</option>
                {myCards.map((card) => (
                  <option key={card.cardId} value={card.cardId}>
                    {card.playerName}
                  </option>
                ))}
              </select>

              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                {t("priceOptional")}
              </label>
              <input
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="EUR"
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setOfferOpen(false)}
                  className="flex-1 h-11 rounded-xl bg-zinc-800 text-xs font-black uppercase tracking-widest text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  onClick={submitOffer}
                  className="flex-1 h-11 rounded-xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  disabled={!offerCardId}
                >
                  {t("sendLabel")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
