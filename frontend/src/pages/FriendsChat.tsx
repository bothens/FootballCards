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
  const [deletingChat, setDeletingChat] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);
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

  const deleteConversation = async () => {
    if (!selectedFriend) return;
    const confirmed = window.confirm(t("deleteChatConfirm"));
    if (!confirmed) return;

    setDeletingChat(true);
    try {
      await MessagesService.deleteConversation(selectedFriend.userId);
      setMessages([]);
      const updatedThreads = await MessagesService.getThreads();
      setThreads(updatedThreads);
      alert(t("deleteChatSuccess"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not delete chat";
      alert(message);
    } finally {
      setDeletingChat(false);
    }
  };

  const deleteMessage = async (messageId: number) => {
    const confirmed = window.confirm(t("deleteMessageConfirm"));
    if (!confirmed) return;
    setDeletingMessageId(messageId);
    try {
      await MessagesService.deleteMessage(messageId);
      setMessages((prev) => prev.filter((msg) => msg.messageId !== messageId));
      const updatedThreads = await MessagesService.getThreads();
      setThreads(updatedThreads);
      alert(t("deleteMessageSuccess"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not delete message";
      alert(message);
    } finally {
      setDeletingMessageId(null);
    }
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-900/70 border border-zinc-800 rounded-2xl px-4 py-3 shadow-2xl">
          <div>
            <h1 className="text-2xl font-black">{t("chatTitle")}</h1>
            <p className="text-zinc-400 text-sm">
              {selectedFriend ? selectedFriend.displayName : t("selectFriendToChat")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={deleteConversation}
              disabled={!selectedFriend || deletingChat}
              className="h-9 px-3 rounded-full bg-rose-500/15 text-rose-200 border border-rose-500/30 text-[10px] font-black uppercase tracking-widest flex items-center justify-center disabled:opacity-50"
            >
              {deletingChat ? t("deleting") : t("deleteChat")}
            </button>
            <Link
              to="/friends"
              className="h-9 px-3 rounded-full bg-zinc-800 text-zinc-200 text-[10px] font-black uppercase tracking-widest flex items-center justify-center"
            >
              {t("backToFriends")}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{t("yourFriendsLabel")}</div>
              <Link to="/friends" className="text-[10px] uppercase tracking-widest font-black text-emerald-300">
                {t("openChat")}
              </Link>
            </div>
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
                  <div className="flex items-center gap-3">
                    <img
                      src={friend.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.userId}`}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full border border-zinc-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold truncate">{friend.displayName}</div>
                        {thread?.unreadCount ? (
                          <span className="text-[10px] font-black uppercase text-emerald-400">
                            {thread.unreadCount} {t("newLabel")}
                          </span>
                        ) : null}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate">
                        {thread?.lastMessage || t("noMessages")}
                      </div>
                    </div>
                  </div>
                  {thread?.lastMessageAt ? (
                    <div className="mt-2 text-[9px] text-zinc-500">
                      {new Date(thread.lastMessageAt).toLocaleString()}
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {selectedFriend && (
                  <img
                    src={selectedFriend.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedFriend.userId}`}
                    alt="Avatar"
                    className="h-9 w-9 rounded-full border border-emerald-500/40"
                  />
                )}
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t("chatTitle")}</h2>
                  <p className="text-zinc-500 text-xs">
                    {selectedFriend ? selectedFriend.displayName : t("selectFriendToChat")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openOffer}
                disabled={!selectedFriend}
                className="h-9 px-4 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {t("offerTrade")}
              </button>
            </div>

            <div className="h-80 overflow-y-auto rounded-2xl border border-zinc-800 bg-black/40 p-3 space-y-2">
              {messages.length === 0 && (
                <div className="text-xs text-zinc-500">{t("noMessages")}</div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.messageId}
                  className={`group relative max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                    msg.senderId === myUserId
                      ? "ml-auto bg-emerald-500/15 text-emerald-100 border border-emerald-500/25"
                      : "bg-black/60 text-zinc-200 border border-zinc-800"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {msg.body}
                  {msg.senderId === myUserId && (
                    <button
                      type="button"
                      onClick={() => deleteMessage(msg.messageId)}
                      disabled={deletingMessageId === msg.messageId}
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/40 text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={t("deleteMessage")}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-full border border-zinc-800 bg-black/60 px-3 py-2">
              <input
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder={t("writeMessage")}
                className="flex-1 bg-transparent text-white placeholder:text-zinc-600 focus:outline-none text-sm"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!selectedFriend}
                className="h-9 px-4 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
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
