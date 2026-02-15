import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";
import FriendsService from "../services/FriendsService";
import TradesService from "../services/TradesService";
import * as api from "../api/api";
import type { FriendDto, FriendRequestDto } from "../types/dtos/friends";
import type { TradeOfferDto } from "../types/dtos/trades";

type RightTab = "friends" | "offers";

const avatarFor = (userId: number, imageUrl?: string | null) =>
  imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

export const Friends: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useI18n();

  const [friends, setFriends] = useState<FriendDto[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequestDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FriendDto[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTouched, setSearchTouched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [incomingOffers, setIncomingOffers] = useState<TradeOfferDto[]>([]);
  const [outgoingOffers, setOutgoingOffers] = useState<TradeOfferDto[]>([]);
  const [rightTab, setRightTab] = useState<RightTab>("friends");

  const myUserId = user?.id ? Number(user.id) : 0;

  const pendingIncoming = useMemo(
    () => friendRequests.filter((r) => r.status === "Pending" && r.addresseeId === myUserId),
    [friendRequests, myUserId]
  );
  const pendingOutgoing = useMemo(
    () => friendRequests.filter((r) => r.status === "Pending" && r.requesterId === myUserId),
    [friendRequests, myUserId]
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    const load = async () => {
      const [friendsRes, requestsRes, incomingRes, outgoingRes] = await Promise.allSettled([
        FriendsService.getFriends(),
        FriendsService.getRequests(),
        TradesService.getIncoming(),
        TradesService.getOutgoing(),
      ]);

      if (friendsRes.status === "fulfilled") setFriends(friendsRes.value);
      if (requestsRes.status === "fulfilled") setFriendRequests(requestsRes.value);
      if (incomingRes.status === "fulfilled") setIncomingOffers(incomingRes.value);
      if (outgoingRes.status === "fulfilled") setOutgoingOffers(outgoingRes.value);
    };

    void load();
  }, [isAuthenticated]);

  const runSearch = async (query: string) => {
    const trimmed = query.trim();
    setSearchTouched(true);

    if (trimmed.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    try {
      const results = await api.searchUsers(trimmed);
      const normalized = results.map((u) => ({
        userId: u.userId,
        displayName: u.displayName,
        email: u.email,
        imageUrl: u.imageUrl,
      }));
      setSearchResults(normalized.filter((u) => u.userId !== myUserId));
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : "Search failed");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setSearchTouched(false);
      setSearchError(null);
      return;
    }
    void runSearch(searchQuery);
  }, [searchQuery, myUserId]);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const requestFriend = async (targetUserId: number) => {
    try {
      await FriendsService.requestFriend({ targetUserId });
      setFriendRequests(await FriendsService.getRequests());
      setSearchQuery("");
      setSearchResults([]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not send request");
    }
  };

  const acceptRequest = async (friendRequestId: number) => {
    try {
      await FriendsService.acceptRequest({ friendRequestId });
      const [friendsRes, requestsRes] = await Promise.all([
        FriendsService.getFriends(),
        FriendsService.getRequests(),
      ]);
      setFriends(friendsRes);
      setFriendRequests(requestsRes);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not accept request");
    }
  };

  const rejectRequest = async (friendRequestId: number) => {
    try {
      await FriendsService.rejectRequest({ friendRequestId });
      setFriendRequests(await FriendsService.getRequests());
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not reject request");
    }
  };

  const acceptOffer = async (tradeOfferId: number) => {
    try {
      await TradesService.acceptOffer({ tradeOfferId });
      const [incoming, outgoing] = await Promise.all([
        TradesService.getIncoming(),
        TradesService.getOutgoing(),
      ]);
      setIncomingOffers(incoming);
      setOutgoingOffers(outgoing);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not accept offer");
    }
  };

  const rejectOffer = async (tradeOfferId: number) => {
    try {
      await TradesService.rejectOffer({ tradeOfferId });
      setIncomingOffers(await TradesService.getIncoming());
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Could not reject offer");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t("friendsTitle")}</h1>
              <p className="text-zinc-400 text-sm mt-1">{t("friendsSubtitle")}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] uppercase tracking-widest">
              <div className="rounded-xl border border-zinc-700 bg-black/40 px-3 py-2 text-zinc-300">
                <div className="text-zinc-500">{t("yourFriendsLabel")}</div>
                <div className="text-sm font-black text-white mt-1">{friends.length}</div>
              </div>
              <div className="rounded-xl border border-zinc-700 bg-black/40 px-3 py-2 text-zinc-300">
                <div className="text-zinc-500">{t("requestsLabel")}</div>
                <div className="text-sm font-black text-emerald-300 mt-1">{pendingIncoming.length}</div>
              </div>
              <div className="rounded-xl border border-zinc-700 bg-black/40 px-3 py-2 text-zinc-300">
                <div className="text-zinc-500">{t("tradeOffers")}</div>
                <div className="text-sm font-black text-cyan-300 mt-1">{incomingOffers.length + outgoingOffers.length}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5 space-y-4">
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-500">{t("searchUsersLabel")}</h2>
                {searchTouched && <span className="text-[10px] text-zinc-500">{searchLoading ? t("loading") : searchResults.length}</span>}
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-black/50 px-3 py-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                  placeholder={t("searchUsersPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => void runSearch(searchQuery)}
                  className="h-9 px-4 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                >
                  {t("searchButton")}
                </button>
              </div>

              {searchTouched && searchQuery.trim().length < 2 && <div className="text-xs text-zinc-500 mt-3">{t("minSearchChars")}</div>}
              {searchError && <div className="text-xs text-red-400 mt-3">{searchError}</div>}
              {searchTouched && !searchLoading && !searchError && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                <div className="text-xs text-zinc-500 mt-3">{t("noResults")}</div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2 mt-3 max-h-[320px] overflow-y-auto pr-1">
                  {searchResults.map((result) => (
                    <div key={result.userId} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/35 px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={avatarFor(result.userId, result.imageUrl)} alt="Avatar" className="h-9 w-9 rounded-full border border-zinc-700" />
                        <div className="min-w-0">
                          <div className="text-sm font-bold truncate">{result.displayName}</div>
                          <div className="text-[10px] text-zinc-500 truncate">{result.email}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => void requestFriend(result.userId)}
                        className="h-8 px-3 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                      >
                        {t("addFriendButton")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-widest font-black text-zinc-500">{t("requestsLabel")}</div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300">{pendingIncoming.length}</span>
              </div>

              {pendingIncoming.length === 0 ? (
                <div className="text-xs text-zinc-500">{t("noFriends")}</div>
              ) : (
                pendingIncoming.map((req) => (
                  <div key={req.friendRequestId} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/30 px-3 py-2">
                    <div className="text-sm font-bold">{req.requesterName}</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void acceptRequest(req.friendRequestId)}
                        className="h-8 px-3 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                      >
                        {t("accept")}
                      </button>
                      <button
                        type="button"
                        onClick={() => void rejectRequest(req.friendRequestId)}
                        className="h-8 px-3 rounded-xl bg-zinc-800 text-zinc-200 text-[10px] font-black uppercase tracking-widest"
                      >
                        {t("reject")}
                      </button>
                    </div>
                  </div>
                ))
              )}

              <div className="pt-2">
                <div className="text-[11px] uppercase tracking-widest font-black text-zinc-500">{t("pendingLabel")}</div>
                {pendingOutgoing.length === 0 ? (
                  <div className="text-xs text-zinc-500 mt-2">-</div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {pendingOutgoing.map((req) => (
                      <span key={req.friendRequestId} className="px-3 py-1 rounded-full border border-zinc-800 text-[10px] text-zinc-400">
                        {req.addresseeName}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="xl:col-span-7 space-y-4">
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRightTab("friends")}
                  className={`h-11 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors ${
                    rightTab === "friends" ? "bg-emerald-500 text-black" : "bg-black/40 text-zinc-400 hover:text-white"
                  }`}
                >
                  {t("yourFriendsLabel")}
                </button>
                <button
                  type="button"
                  onClick={() => setRightTab("offers")}
                  className={`h-11 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors ${
                    rightTab === "offers" ? "bg-emerald-500 text-black" : "bg-black/40 text-zinc-400 hover:text-white"
                  }`}
                >
                  {t("tradeOffers")}
                </button>
              </div>
            </section>

            {rightTab === "friends" && (
              <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
                {friends.length === 0 ? (
                  <div className="text-xs text-zinc-500">{t("noFriends")}</div>
                ) : (
                  <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
                    {friends.map((friend) => (
                      <div key={friend.userId} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/30 px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={avatarFor(friend.userId, friend.imageUrl)} alt="Avatar" className="h-10 w-10 rounded-full border border-zinc-700" />
                          <div className="min-w-0">
                            <div className="text-sm font-bold truncate">{friend.displayName}</div>
                            <div className="text-[10px] text-zinc-500 truncate">{friend.email}</div>
                          </div>
                        </div>
                        <Link
                          to={`/friends/chat/${friend.userId}`}
                          className="h-8 px-3 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest flex items-center"
                        >
                          {t("openChat")}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {rightTab === "offers" && (
              <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-zinc-800 bg-black/30 p-3">
                    <div className="text-[10px] uppercase tracking-widest font-black text-zinc-600 mb-2">{t("incomingLabel")}</div>
                    {incomingOffers.length === 0 ? (
                      <div className="text-xs text-zinc-500">{t("noIncomingOffers")}</div>
                    ) : (
                      incomingOffers.map((offer) => (
                        <div key={offer.tradeOfferId} className="rounded-xl border border-zinc-800 bg-black/40 p-3 mb-2">
                          <div className="text-sm font-bold">{offer.cardPlayerName}</div>
                          <div className="text-[10px] text-zinc-500">{t("fromLabel")}: {offer.fromUserName}</div>
                          {offer.price ? <div className="text-[10px] text-emerald-300">EUR {offer.price.toLocaleString()}</div> : null}
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => void acceptOffer(offer.tradeOfferId)}
                              className="h-8 px-3 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                            >
                              {t("accept")}
                            </button>
                            <button
                              type="button"
                              onClick={() => void rejectOffer(offer.tradeOfferId)}
                              className="h-8 px-3 rounded-xl bg-zinc-800 text-zinc-200 text-[10px] font-black uppercase tracking-widest"
                            >
                              {t("reject")}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black/30 p-3">
                    <div className="text-[10px] uppercase tracking-widest font-black text-zinc-600 mb-2">{t("outgoingLabel")}</div>
                    {outgoingOffers.length === 0 ? (
                      <div className="text-xs text-zinc-500">{t("noOutgoingOffers")}</div>
                    ) : (
                      outgoingOffers.map((offer) => (
                        <div key={offer.tradeOfferId} className="rounded-xl border border-zinc-800 bg-black/40 p-3 mb-2">
                          <div className="text-sm font-bold">{offer.cardPlayerName}</div>
                          <div className="text-[10px] text-zinc-500">{t("toLabel")}: {offer.toUserName}</div>
                          <div className="text-[10px] text-zinc-500">{t("statusLabel")}: {offer.status}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

