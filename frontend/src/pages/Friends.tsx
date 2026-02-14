import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";
import FriendsService from "../services/FriendsService";
import TradesService from "../services/TradesService";
import * as api from "../api/api";
import type { FriendDto, FriendRequestDto } from "../types/dtos/friends";
import type { TradeOfferDto } from "../types/dtos/trades";

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

  const myUserId = user?.id ? Number(user.id) : 0;
  const pendingIncoming = friendRequests.filter(
    (r) => r.status === "Pending" && r.addresseeId === myUserId
  );
  const pendingOutgoing = friendRequests.filter(
    (r) => r.status === "Pending" && r.requesterId === myUserId
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const [friendsRes, requestsRes, incomingRes, outgoingRes] = await Promise.all([
          FriendsService.getFriends(),
          FriendsService.getRequests(),
          TradesService.getIncoming(),
          TradesService.getOutgoing(),
        ]);
        setFriends(friendsRes);
        setFriendRequests(requestsRes);
        setIncomingOffers(incomingRes);
        setOutgoingOffers(outgoingRes);
      } catch {
        // silent
      }
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
      const filtered = normalized.filter((u) => u.userId !== myUserId);
      setSearchResults(filtered);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Search failed";
      setSearchError(message);
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
      const requests = await FriendsService.getRequests();
      setFriendRequests(requests);
      setSearchQuery("");
      setSearchResults([]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not send request";
      alert(message);
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
      const message = err instanceof Error ? err.message : "Could not accept request";
      alert(message);
    }
  };

  const rejectRequest = async (friendRequestId: number) => {
    try {
      await FriendsService.rejectRequest({ friendRequestId });
      const requestsRes = await FriendsService.getRequests();
      setFriendRequests(requestsRes);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not reject request";
      alert(message);
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
      const message = err instanceof Error ? err.message : "Could not accept offer";
      alert(message);
    }
  };

  const rejectOffer = async (tradeOfferId: number) => {
    try {
      await TradesService.rejectOffer({ tradeOfferId });
      const incoming = await TradesService.getIncoming();
      setIncomingOffers(incoming);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not reject offer";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl px-5 py-4 shadow-2xl">
          <h1 className="text-xl font-black">{t("friendsTitle")}</h1>
          <p className="text-zinc-500 text-xs">{t("friendsSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6">
          <div className="space-y-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-500">{t("searchUsersLabel")}</h2>
                {searchTouched && (
                  <span className="text-[10px] text-zinc-500">
                    {searchLoading ? t("loading") : `${searchResults.length}`}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-black/60 px-3 py-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                  placeholder={t("searchUsersPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => runSearch(searchQuery)}
                  className="h-8 px-3 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                >
                  {t("searchButton")}
                </button>
              </div>

              {searchTouched && searchQuery.trim().length < 2 && (
                <div className="text-xs text-zinc-500">{t("minSearchChars")}</div>
              )}
              {searchError && (
                <div className="text-xs text-red-400">{searchError}</div>
              )}
              {searchTouched && !searchLoading && !searchError && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                <div className="text-xs text-zinc-500">{t("noResults")}</div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <div key={result.userId} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/30 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={result.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.userId}`}
                          alt="Avatar"
                          className="h-8 w-8 rounded-full border border-zinc-700"
                        />
                        <div>
                          <div className="text-sm font-bold">{result.displayName}</div>
                          <div className="text-[10px] text-zinc-500">{result.email}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => requestFriend(result.userId)}
                        className="h-7 px-3 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                      >
                        {t("addFriendButton")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-widest font-black text-zinc-500">{t("requestsLabel")}</div>
                {pendingIncoming.length > 0 && (
                  <span className="text-[10px] text-emerald-300">
                    {pendingIncoming.length}
                  </span>
                )}
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
                        onClick={() => acceptRequest(req.friendRequestId)}
                        className="h-7 px-3 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                      >
                        {t("accept")}
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectRequest(req.friendRequestId)}
                        className="h-7 px-3 rounded-full bg-zinc-800 text-zinc-200 text-[10px] font-black uppercase tracking-widest"
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
                  <div className="text-xs text-zinc-500">-</div>
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
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="text-[11px] uppercase tracking-widest font-black text-zinc-500">{t("yourFriendsLabel")}</div>
            {friends.length === 0 && (
              <div className="text-xs text-zinc-500">{t("noFriends")}</div>
            )}
            {friends.map((friend) => (
              <div key={friend.userId} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/30 px-3 py-2">
                <div className="flex items-center gap-2">
                  <img
                    src={friend.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.userId}`}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full border border-zinc-700"
                  />
                  <div>
                    <div className="text-sm font-bold">{friend.displayName}</div>
                    <div className="text-[10px] text-zinc-500">{friend.email}</div>
                  </div>
                </div>
                <Link
                  to={`/friends/chat/${friend.userId}`}
                  className="h-8 px-3 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest flex items-center"
                >
                  {t("openChat")}
                </Link>
              </div>
            ))}
            <div className="pt-4">
              <div className="text-[11px] uppercase tracking-widest font-black text-zinc-500 mb-2">{t("tradeOffers")}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-black text-zinc-600 mb-2">{t("incomingLabel")}</div>
                  {incomingOffers.length === 0 ? (
                    <div className="text-xs text-zinc-500">{t("noIncomingOffers")}</div>
                  ) : (
                    incomingOffers.map((offer) => (
                      <div key={offer.tradeOfferId} className="rounded-xl border border-zinc-800 bg-black/30 p-3 mb-2">
                        <div className="text-sm font-bold">{offer.cardPlayerName}</div>
                        <div className="text-[10px] text-zinc-500">{t("fromLabel")}: {offer.fromUserName}</div>
                        {offer.price ? (
                          <div className="text-[10px] text-emerald-300">EUR {offer.price.toLocaleString()}</div>
                        ) : null}
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => acceptOffer(offer.tradeOfferId)}
                            className="h-7 px-3 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                          >
                            {t("accept")}
                          </button>
                          <button
                            type="button"
                            onClick={() => rejectOffer(offer.tradeOfferId)}
                            className="h-7 px-3 rounded-full bg-zinc-800 text-zinc-200 text-[10px] font-black uppercase tracking-widest"
                          >
                            {t("reject")}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-black text-zinc-600 mb-2">{t("outgoingLabel")}</div>
                  {outgoingOffers.length === 0 ? (
                    <div className="text-xs text-zinc-500">{t("noOutgoingOffers")}</div>
                  ) : (
                    outgoingOffers.map((offer) => (
                      <div key={offer.tradeOfferId} className="rounded-xl border border-zinc-800 bg-black/30 p-3 mb-2">
                        <div className="text-sm font-bold">{offer.cardPlayerName}</div>
                        <div className="text-[10px] text-zinc-500">{t("toLabel")}: {offer.toUserName}</div>
                        <div className="text-[10px] text-zinc-500">{t("statusLabel")}: {offer.status}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
