"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, PawPrint, Search, X } from "lucide-react";
import AdminConversationArchiveButton from "./AdminConversationArchiveButton";

export type AdminConversationItem = {
  id: string;
  customerName: string;
  customerAvatarUrl: string | null;
  puppyName: string | null;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  lastMessageSenderRole: "customer" | "admin" | null;
  unreadCount: number;
  isArchived: boolean;
};

type FilterKey = "all" | "unread" | "awaiting";

function formatConversationTime(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatWaitingTime(value: string | null) {
  if (!value) return null;

  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function AdminInboxList({
  conversations,
}: {
  conversations: AdminConversationItem[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showArchived, setShowArchived] = useState(false);

  const filtered = useMemo(() => {
    let list = conversations.filter((c) => c.isArchived === showArchived);

    if (filter === "unread") {
      list = list.filter((c) => c.unreadCount > 0);
    } else if (filter === "awaiting") {
      list = list.filter(
        (c) => c.lastMessageSenderRole === "customer"
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.customerName.toLowerCase().includes(q) ||
          (c.puppyName ?? "").toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      const aUnread = a.unreadCount > 0 ? 1 : 0;
      const bUnread = b.unreadCount > 0 ? 1 : 0;

      if (aUnread !== bUnread) return bUnread - aUnread;

      const aTime = a.lastMessageAt
        ? new Date(a.lastMessageAt).getTime()
        : 0;
      const bTime = b.lastMessageAt
        ? new Date(b.lastMessageAt).getTime()
        : 0;

      return bTime - aTime;
    });
  }, [conversations, filter, search, showArchived]);

  const unreadTotal = conversations.filter(
    (c) => !c.isArchived && c.unreadCount > 0
  ).length;

  const awaitingTotal = conversations.filter(
    (c) => !c.isArchived && c.lastMessageSenderRole === "customer"
  ).length;

  const archivedTotal = conversations.filter((c) => c.isArchived).length;

  return (
    <div>
      {/* Search */}
      <div className="relative mb-3">
        <Search
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sage"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer or puppy…"
          className="w-full rounded-full border border-sage/15 bg-white py-2.5 pl-10 pr-9 text-sm text-ink outline-none transition focus:border-gold"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-sage hover:bg-sage/10"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {(
          [
            { key: "all", label: "All" },
            { key: "unread", label: `Unread${unreadTotal ? ` (${unreadTotal})` : ""}` },
            {
              key: "awaiting",
              label: `Awaiting reply${awaitingTotal ? ` (${awaitingTotal})` : ""}`,
            },
          ] as { key: FilterKey; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              filter === tab.key
                ? "bg-forest text-cream"
                : "border border-sage/15 bg-white text-ink/60 hover:border-forest/20"
            }`}
          >
            {tab.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setShowArchived((v) => !v)}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
            showArchived
              ? "bg-forest text-cream"
              : "border border-sage/15 bg-white text-ink/60 hover:border-forest/20"
          }`}
        >
          Archived{archivedTotal ? ` (${archivedTotal})` : ""}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-sage/10 bg-white px-6 py-16 text-center">
          <p className="text-sm text-ink/50">
            {search
              ? "No conversations match your search."
              : showArchived
                ? "No archived conversations."
                : "No conversations here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-sage/10 bg-white">
          {filtered.map((conversation) => {
            const hasUnread = conversation.unreadCount > 0;
            const previewPrefix =
              conversation.lastMessageSenderRole === "admin" ? "You: " : "";
            const waiting =
              conversation.lastMessageSenderRole === "customer"
                ? formatWaitingTime(conversation.lastMessageAt)
                : null;

            return (
              <div
                key={conversation.id}
                className="group flex items-center gap-3 border-b border-sage/10 px-4 py-4 transition last:border-b-0 hover:bg-sage/[0.04] sm:px-5"
              >
                <Link
                  href={`/admin/messages/${conversation.id}`}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  {conversation.customerAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={conversation.customerAvatarUrl}
                      alt={conversation.customerName}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-cream">
                      {conversation.customerName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          {hasUnread && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
                          )}
                          <p
                            className={`truncate text-sm ${
                              hasUnread
                                ? "font-semibold text-forest"
                                : "font-medium text-ink"
                            }`}
                          >
                            {conversation.customerName}
                          </p>
                        </div>

                        {conversation.puppyName && (
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-ink/45">
                            <PawPrint size={12} strokeWidth={1.5} />
                            <span className="truncate">
                              About {conversation.puppyName}
                            </span>
                          </div>
                        )}
                      </div>

                      {conversation.lastMessageAt && (
                        <span
                          className={`shrink-0 text-[11px] ${
                            hasUnread
                              ? "font-semibold text-forest"
                              : "text-ink/40"
                          }`}
                        >
                          {formatConversationTime(conversation.lastMessageAt)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      <p
                        className={`min-w-0 flex-1 truncate text-sm ${
                          hasUnread
                            ? "font-medium text-ink/75"
                            : "text-ink/45"
                        }`}
                      >
                        {conversation.lastMessagePreview
                          ? `${previewPrefix}${conversation.lastMessagePreview}`
                          : "No messages yet"}
                      </p>

                      {waiting && (
                        <span className="shrink-0 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-forest">
                          Waiting {waiting}
                        </span>
                      )}

                      {hasUnread && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-forest px-1.5 text-[10px] font-semibold text-cream">
                          {conversation.unreadCount > 99
                            ? "99+"
                            : conversation.unreadCount}
                        </span>
                      )}

                      <ChevronRight
                        size={17}
                        strokeWidth={1.5}
                        className="shrink-0 text-ink/25 transition group-hover:translate-x-0.5 group-hover:text-forest"
                      />
                    </div>
                  </div>
                </Link>

                <AdminConversationArchiveButton
                  conversationId={conversation.id}
                  isArchived={conversation.isArchived}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}