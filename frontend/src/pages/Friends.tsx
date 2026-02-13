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
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <h1 className="text-2xl font-black">{t("friendsTitle")}</h1>
          <p className="text-zinc-400 text-sm">{t("friendsSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t("searchUsersLabel")}</h2>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-2 tracking-widest">
                {t("searchUsersLabel")}
              </label>
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  placeholder={t("searchUsersPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => runSearch(searchQuery)}
                  className="h-11 px-4 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                >
                  {t("searchButton")}
                </button>
              </div>
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
                  <div key={result.userId} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/40 px-3 py-2">
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
                      className="h-8 px-3 rounded-lg bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                    >
                      {t("addFriendButton")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{t("requestsLabel")}</div>
              {pendingIncoming.length === 0 ? (
                <div className="text-xs text-zinc-500">{t("noFriends")}</div>
              ) : (
                pendingIncoming.map((req) => (
                  <div key={req.friendRequestId} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/40 px-3 py-2">
                    <div className="text-sm font-bold">{req.requesterName}</div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => acceptRequest(req.friendRequestId)}
                        className="h-7 px-3 rounded-lg bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                      >
                        {t("accept")}
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectRequest(req.friendRequestId)}
                        className="h-7 px-3 rounded-lg bg-zinc-800 text-zinc-200 text-[10px] font-black uppercase tracking-widest"
                      >
                        {t("reject")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{t("pendingLabel")}</div>
              {pendingOutgoing.length === 0 ? (
                <div className="text-xs text-zinc-500">-</div>
              ) : (
                pendingOutgoing.map((req) => (
                  <div key={req.friendRequestId} className="rounded-xl border border-zinc-800 bg-black/40 px-3 py-2 text-sm">
                    {req.addresseeName}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{t("yourFriendsLabel")}</div>
            {friends.length === 0 && (
              <div className="text-xs text-zinc-500">{t("noFriends")}</div>
            )}
            {friends.map((friend) => (
              <div key={friend.userId} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-black/40 px-3 py-2">
                <div>
                  <div className="text-sm font-bold">{friend.displayName}</div>
                  <div className="text-[10px] text-zinc-500">{friend.email}</div>
                </div>
                <Link
                  to={`/friends/chat/${friend.userId}`}
                  className="h-8 px-3 rounded-lg bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest flex items-center"
                >
                  {t("openChat")}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest font-black text-zinc-500 mb-2">{t("incomingLabel")}</div>
              {incomingOffers.length === 0 ? (
                <div className="text-xs text-zinc-500">{t("noIncomingOffers")}</div>
              ) : (
                incomingOffers.map((offer) => (
                  <div key={offer.tradeOfferId} className="rounded-xl border border-zinc-800 bg-black/40 p-3 mb-2">
                    <div className="text-sm font-bold">{offer.cardPlayerName}</div>
                    <div className="text-[10px] text-zinc-500">{t("fromLabel")}: {offer.fromUserName}</div>
                    {offer.price ? (
                      <div className="text-[10px] text-emerald-300">EUR {offer.price.toLocaleString()}</div>
                    ) : null}
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => acceptOffer(offer.tradeOfferId)}
                        className="h-7 px-3 rounded-lg bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest"
                      >
                        {t("accept")}
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectOffer(offer.tradeOfferId)}
                        className="h-7 px-3 rounded-lg bg-zinc-800 text-zinc-200 text-[10px] font-black uppercase tracking-widest"
                      >
                        {t("reject")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest font-black text-zinc-500 mb-2">{t("outgoingLabel")}</div>
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
        </div>
      </div>
    </div>
  );
};
