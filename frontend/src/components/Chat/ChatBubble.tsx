import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useI18n } from "../../hooks/useI18n";
import MessagesService from "../../services/MessagesService";
import type { MessageDto, MessageThreadDto } from "../../types/dtos/messages";

export const ChatBubble: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useI18n();

  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<MessageThreadDto[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThreadDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [messageBody, setMessageBody] = useState("");

  const myUserId = user?.id ? Number(user.id) : 0;

  const unreadTotal = useMemo(
    () => threads.reduce((acc, thread) => acc + thread.unreadCount, 0),
    [threads]
  );

  const loadThreads = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await MessagesService.getThreads();
      setThreads(data);
    } catch {
      // silent
    }
  };

  const openThread = async (thread: MessageThreadDto) => {
    setSelectedThread(thread);
    try {
      const data = await MessagesService.getConversation(thread.friendId);
      setMessages(data);
      await MessagesService.markRead(thread.friendId);
      await loadThreads();
    } catch {
      // silent
    }
  };

  const sendMessage = async () => {
    if (!selectedThread) return;
    const body = messageBody.trim();
    if (!body) return;
    try {
      await MessagesService.sendMessage({ toUserId: selectedThread.friendId, body });
      setMessageBody("");
      const data = await MessagesService.getConversation(selectedThread.friendId);
      setMessages(data);
      await loadThreads();
    } catch {
      // silent
    }
  };

  useEffect(() => {
    void loadThreads();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(() => {
      void loadThreads();
    }, 12000);
    return () => clearInterval(id);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 99999,
        pointerEvents: "auto",
      }}
    >
      {open && (
        <div
          style={{
            width: 340,
            maxWidth: "calc(100vw - 24px)",
            height: 500,
            marginBottom: 10,
            borderRadius: 16,
            border: "1px solid #27272a",
            background: "rgba(9,9,11,0.96)",
            color: "white",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #27272a", padding: "10px 12px" }}>
            <strong style={{ fontSize: 12 }}>{selectedThread ? selectedThread.friendName : t("chatTitle")}</strong>
            <button type="button" onClick={() => { if (selectedThread) { setSelectedThread(null); setMessages([]); } else { setOpen(false); } }} style={{ background: "transparent", color: "#a1a1aa", border: 0, cursor: "pointer" }}>
              {selectedThread ? "<" : "X"}
            </button>
          </div>

          {!selectedThread && (
            <div style={{ overflowY: "auto", padding: 8, flex: 1 }}>
              {threads.length === 0 ? (
                <div style={{ color: "#71717a", fontSize: 12, padding: 12 }}>{t("noMessages")}</div>
              ) : (
                threads.map((thread) => (
                  <button
                    key={thread.friendId}
                    type="button"
                    onClick={() => void openThread(thread)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: "1px solid #27272a",
                      borderRadius: 10,
                      background: "rgba(0,0,0,0.35)",
                      color: "white",
                      padding: "8px 10px",
                      marginBottom: 6,
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{thread.friendName}</span>
                      {thread.unreadCount > 0 && (
                        <span style={{ background: "#10b981", color: "#000", borderRadius: 9999, minWidth: 20, height: 20, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{thread.unreadCount}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: "#71717a", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{thread.lastMessage || t("noMessages")}</div>
                  </button>
                ))
              )}
            </div>
          )}

          {selectedThread && (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
                {messages.map((msg) => (
                  <div
                    key={msg.messageId}
                    style={{
                      maxWidth: "78%",
                      marginLeft: msg.senderId === myUserId ? "auto" : 0,
                      background: msg.senderId === myUserId ? "rgba(16,185,129,0.2)" : "rgba(0,0,0,0.45)",
                      border: "1px solid #27272a",
                      borderRadius: 12,
                      padding: "8px 10px",
                      fontSize: 12,
                      marginBottom: 6,
                    }}
                  >
                    {msg.body}
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #27272a", padding: 8, display: "flex", gap: 8 }}>
                <input
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder={t("writeMessage")}
                  style={{ flex: 1, background: "#09090b", color: "white", border: "1px solid #27272a", borderRadius: 9999, padding: "8px 12px", fontSize: 12 }}
                />
                <button type="button" onClick={() => void sendMessage()} style={{ borderRadius: 9999, border: 0, background: "#10b981", color: "#000", fontWeight: 800, fontSize: 10, padding: "0 12px", cursor: "pointer" }}>
                  {t("sendLabel")}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: 64,
          height: 64,
          borderRadius: 9999,
          border: "3px solid #ffffff",
          background: "#10b981",
          color: "#000000",
          fontWeight: 900,
          fontSize: 12,
          boxShadow: "0 0 0 4px rgba(0,0,0,0.45), 0 0 30px rgba(16,185,129,0.7)",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={t("chatTitle")}
      >
        CHAT
        {unreadTotal > 0 && (
          <span
            style={{
              position: "absolute",
              right: -4,
              top: -4,
              minWidth: 20,
              height: 20,
              borderRadius: 9999,
              background: "#f43f5e",
              color: "white",
              fontSize: 10,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              fontWeight: 800,
            }}
          >
            {unreadTotal}
          </span>
        )}
      </button>
    </div>
  );
};
