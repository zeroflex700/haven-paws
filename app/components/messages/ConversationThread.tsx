"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Send,
  Loader2,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
  PawPrint,
  MoreHorizontal,
  CheckCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import type {
  Message,
  MessageCursor,
} from "@/lib/queries/messages";

type MessageStatus =
  | "sending"
  | "sent"
  | "failed";

type ThreadMessage = Message & {
  status: MessageStatus;
};

type RealtimeMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: "customer" | "admin";
  content: string;
  client_generated_id: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
};

type Puppy = {
  id: string;
  name: string;
  image: string | null;
  breed: string | null;
  breederName: string | null;
  breederPhotoUrl: string | null;
};

type ConversationRole =
  | "customer"
  | "admin";

type ConversationThreadProps = {
  conversationId: string;
  puppy: Puppy;
  role?: ConversationRole;
  initialMessages: Message[];
  initialNextCursor: MessageCursor | null;
  initialHasMore: boolean;
};

type PresenceUser = {
  userId: string;
  role: "customer" | "admin";
  typing: boolean;
  lastActiveAt: string;
};

const PAGE_SIZE = 30;

const TYPING_IDLE_MS = 2_000;
const ACTIVITY_HEARTBEAT_MS = 30_000;

function mapRealtimeMessage(
  message: RealtimeMessage
): Message {
  return {
    id: message.id,
    conversationId: message.conversation_id,
    senderId: message.sender_id,
    senderRole: message.sender_role,
    content: message.content,
    clientGeneratedId:
      message.client_generated_id,
    createdAt: message.created_at,
    editedAt: message.edited_at,
    deletedAt: message.deleted_at,
  };
}

function sortMessages(
  messages: ThreadMessage[]
): ThreadMessage[] {
  return [...messages].sort((a, b) => {
    const timeDifference =
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime();

    if (timeDifference !== 0) {
      return timeDifference;
    }

    return a.id.localeCompare(b.id);
  });
}

function createClientMessageId(): string {
  return crypto.randomUUID();
}

export default function ConversationThread({
  conversationId,
  puppy,
  role = "customer",
  initialMessages,
  initialNextCursor,
  initialHasMore,
}: ConversationThreadProps) {
  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [messages, setMessages] =
    useState<ThreadMessage[]>(() =>
      initialMessages.map((message) => ({
        ...message,
        status: "sent",
      }))
    );

  const [input, setInput] = useState("");

  const [nextCursor, setNextCursor] =
    useState<MessageCursor | null>(
      initialNextCursor
    );

  const [hasMore, setHasMore] =
    useState(initialHasMore);

  const [isLoadingOlder, setIsLoadingOlder] =
    useState(false);

  const [isSending, setIsSending] =
    useState(false);

  const [otherParticipantTyping, setOtherParticipantTyping] =
    useState(false);

  const typingTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const lastActivityRef =
    useRef(0);

  const presenceChannelRef =
    useRef<ReturnType<typeof supabase.channel> | null>(
      null
    );

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);

  const knownMessageIds =
    useRef<Set<string>>(
      new Set(
        initialMessages.map(
          (message) => message.id
        )
      )
    );

  const knownClientIds =
    useRef<Set<string>>(
      new Set(
        initialMessages.map(
          (message) =>
            message.clientGeneratedId
        )
      )
    );

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) {
        setCurrentUserId(data.user?.id ?? null);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUserId(session?.user?.id ?? null);
      }
    );

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  const scrollToBottom = useCallback(
    (
      behavior: ScrollBehavior = "smooth"
    ) => {
      bottomRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    },
    []
  );

  const markConversationRead = useCallback(
    async () => {
      const { error } = await supabase.rpc(
        "mark_conversation_read",
        {
          p_conversation_id: conversationId,
        }
      );

      if (error) {
        console.error(
          "Failed to mark conversation as read:",
          error
        );
      }
    },
    [conversationId]
  );

  useEffect(() => {
    void markConversationRead();
  }, [markConversationRead]);

  useEffect(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  const mergePersistedMessage = useCallback(
    (message: Message) => {
      setMessages((current) => {
        const existingById =
          current.find(
            (item) =>
              item.id === message.id
          );

        if (existingById) {
          return current.map((item) =>
            item.id === message.id
              ? {
                  ...message,
                  status: "sent",
                }
              : item
          );
        }

        const existingByClientId =
          current.find(
            (item) =>
              item.clientGeneratedId ===
              message.clientGeneratedId
          );

        if (existingByClientId) {
          return sortMessages(
            current.map((item) =>
              item.clientGeneratedId ===
              message.clientGeneratedId
                ? {
                    ...message,
                    status: "sent",
                  }
                : item
            )
          );
        }

        return sortMessages([
          ...current,
          {
            ...message,
            status: "sent",
          },
        ]);
      });

      knownMessageIds.current.add(
        message.id
      );

      knownClientIds.current.add(
        message.clientGeneratedId
      );
    },
    []
  );

  /*
   * Customer/admin joins the same Presence channel for this conversation.
   *
   * This connection self-heals: mobile browsers (especially split-screen
   * or pop-up multitasking) throttle backgrounded windows and can silently
   * drop the realtime socket. Without explicit handling, the channel just
   * dies and presence never recovers — messages still work because they
   * ride on Postgres replication, not this socket's heartbeat.
   */
  useEffect(() => {
    if (!currentUserId) return;

    const userId = currentUserId; // narrowed, stable for the life of this effect

    let isMounted = true;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;
    let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    function trackPresence(typing: boolean) {
      if (!channel) return;

      void channel.track({
        userId,
        role,
        typing,
        lastActiveAt: new Date().toISOString(),
      } satisfies PresenceUser);

      lastActivityRef.current = Date.now();
    }

    function updateRemotePresence() {
      if (!channel) return;

      const state = channel.presenceState<PresenceUser>();

      const remoteStates = Object.values(state)
        .flat()
        .filter((presence) => presence.userId !== userId);

      setOtherParticipantTyping(
        remoteStates.some((presence) => presence.typing)
      );
    }

    function setupChannel() {
      channel = supabase.channel(
        `conversation-presence:${conversationId}`,
        {
          config: {
            presence: {
              key: userId,
            },
          },
        }
      );

      presenceChannelRef.current = channel;

      channel
        .on("presence", { event: "sync" }, updateRemotePresence)
        .on("presence", { event: "join" }, updateRemotePresence)
        .on("presence", { event: "leave" }, updateRemotePresence)
        .subscribe((status, err) => {
          if (!isMounted) return;

          if (status === "SUBSCRIBED") {
            trackPresence(false);
            return;
          }

          if (
            status === "CHANNEL_ERROR" ||
            status === "TIMED_OUT" ||
            status === "CLOSED"
          ) {
            console.error(
              "Presence channel disrupted, retrying:",
              status,
              err
            );

            setOtherParticipantTyping(false);

            if (retryTimeout) clearTimeout(retryTimeout);

            retryTimeout = setTimeout(() => {
              if (!isMounted) return;

              if (channel) {
                void supabase.removeChannel(channel);
              }

              setupChannel();
            }, 2000);
          }
        });
    }

    setupChannel();

    // Re-assert presence whenever this window regains focus/visibility —
    // covers the case of a backgrounded pop-up window resuming.
    function handleVisibilityOrFocus() {
      if (document.visibilityState === "visible") {
        trackPresence(false);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    // Periodic heartbeat so presence doesn't go stale on an idle-but-open tab.
    heartbeatInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        trackPresence(false);
      }
    }, ACTIVITY_HEARTBEAT_MS);

    return () => {
      isMounted = false;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (retryTimeout) clearTimeout(retryTimeout);
      if (heartbeatInterval) clearInterval(heartbeatInterval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityOrFocus
      );
      window.removeEventListener("focus", handleVisibilityOrFocus);

      presenceChannelRef.current = null;

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [conversationId, currentUserId, role]);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(
        `conversation:${conversationId}`
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter:
            `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const incoming =
            mapRealtimeMessage(
              payload.new as RealtimeMessage
            );

          if (
            knownMessageIds.current.has(
              incoming.id
            )
          ) {
            return;
          }

          mergePersistedMessage(incoming);

          if (
            incoming.senderId !==
            currentUserId
          ) {
            scrollToBottom();

            void markConversationRead();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    conversationId,
    currentUserId,
    markConversationRead,
    mergePersistedMessage,
    scrollToBottom,
  ]);

  const markPresenceActive = useCallback(
    (typing = false) => {
      const channel =
        presenceChannelRef.current;

      if (!channel || !currentUserId) {
        return;
      }

      const now = Date.now();

      if (
        !typing &&
        now - lastActivityRef.current <
          ACTIVITY_HEARTBEAT_MS
      ) {
        return;
      }

      lastActivityRef.current = now;

      void channel.track({
        userId: currentUserId,
        role,
        typing,
        lastActiveAt: new Date().toISOString(),
      } satisfies PresenceUser);
    },
    [currentUserId, role]
  );

  const handleTyping = useCallback(() => {
    markPresenceActive(true);

    if (typingTimeoutRef.current) {
      clearTimeout(
        typingTimeoutRef.current
      );
    }

    typingTimeoutRef.current =
      setTimeout(() => {
        markPresenceActive(false);
      }, TYPING_IDLE_MS);
  }, [markPresenceActive]);

  async function loadOlderMessages() {
    if (
      !hasMore ||
      !nextCursor ||
      isLoadingOlder
    ) {
      return;
    }

    setIsLoadingOlder(true);

    try {
      const params =
        new URLSearchParams({
          limit: String(PAGE_SIZE),
          createdAt:
            nextCursor.createdAt,
          id: nextCursor.id,
        });

      const endpoint =
        role === "admin"
          ? `/api/admin/messages/${conversationId}`
          : `/api/messages/${conversationId}`;

      const response = await fetch(
        `${endpoint}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          "Could not load older messages"
        );
      }

      const page =
        (await response.json()) as {
          messages: Message[];
          nextCursor: MessageCursor | null;
          hasMore: boolean;
        };

      page.messages.forEach((message) => {
        knownMessageIds.current.add(
          message.id
        );

        knownClientIds.current.add(
          message.clientGeneratedId
        );
      });

      setMessages((current) => {
        const existingIds = new Set(
          current.map(
            (message) => message.id
          )
        );

        const existingClientIds = new Set(
          current.map(
            (message) =>
              message.clientGeneratedId
          )
        );

        const newMessages =
          page.messages
            .filter(
              (message) =>
                !existingIds.has(
                  message.id
                ) &&
                !existingClientIds.has(
                  message.clientGeneratedId
                )
            )
            .map((message) => ({
              ...message,
              status: "sent" as const,
            }));

        return sortMessages([
          ...newMessages,
          ...current,
        ]);
      });

      setNextCursor(
        page.nextCursor
      );

      setHasMore(page.hasMore);
    } catch (error) {
      console.error(
        "Failed to load older messages:",
        error
      );
    } finally {
      setIsLoadingOlder(false);
    }
  }

  const sendPersistedMessage = useCallback(
    async (
      clientGeneratedId: string,
      content: string
    ) => {
      try {
        const { data, error } =
          await supabase.rpc(
            "send_message",
            {
              p_conversation_id:
                conversationId,
              p_content: content,
              p_client_generated_id:
                clientGeneratedId,
            }
          );

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(
            "Message was not returned"
          );
        }

        const message =
          mapRealtimeMessage(
            data as RealtimeMessage
          );

        mergePersistedMessage(message);

        scrollToBottom();

        return true;
      } catch (error) {
        console.error(
          "Failed to send message:",
          error
        );

        setMessages((current) =>
          current.map((message) =>
            message.clientGeneratedId ===
            clientGeneratedId
              ? {
                  ...message,
                  status: "failed",
                }
              : message
          )
        );

        return false;
      }
    },
    [
      conversationId,
      mergePersistedMessage,
      scrollToBottom,
    ]
  );

  async function submitMessage() {
    const content = input.trim();

    if (!content || isSending || !currentUserId) {
      return;
    }

    const clientGeneratedId =
      createClientMessageId();

    const optimisticId =
      `optimistic:${clientGeneratedId}`;

    const optimisticMessage: ThreadMessage =
      {
        id: optimisticId,
        conversationId,
        senderId: currentUserId,
        senderRole: role,
        content,
        clientGeneratedId,
        createdAt:
          new Date().toISOString(),
        editedAt: null,
        deletedAt: null,
        status: "sending",
      };

    knownClientIds.current.add(
      clientGeneratedId
    );

    setMessages((current) =>
      sortMessages([
        ...current,
        optimisticMessage,
      ])
    );

    setInput("");

    if (typingTimeoutRef.current) {
      clearTimeout(
        typingTimeoutRef.current
      );
    }

    markPresenceActive(false);

    setIsSending(true);

    requestAnimationFrame(() => {
      scrollToBottom();
    });

    try {
      await sendPersistedMessage(
        clientGeneratedId,
        content
      );
    } finally {
      setIsSending(false);
    }
  }

  async function retryMessage(
    message: ThreadMessage
  ) {
    if (
      message.status !== "failed" ||
      isSending
    ) {
      return;
    }

    setMessages((current) =>
      current.map((item) =>
        item.clientGeneratedId ===
        message.clientGeneratedId
          ? {
              ...item,
              status: "sending",
            }
          : item
      )
    );

    setIsSending(true);

    try {
      await sendPersistedMessage(
        message.clientGeneratedId,
        message.content
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<
      HTMLTextAreaElement
    >
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      void submitMessage();
    }
  }

  const canSend =
    input.trim().length > 0 &&
    !isSending &&
    !!currentUserId;

  const messageCount = useMemo(
    () => messages.length,
    [messages.length]
  );

  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col">
      {/* ===================================================== */}
      {/* CONVERSATION CONTEXT                                  */}
      {/* ===================================================== */}

      <div className="border-b border-sage/10 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/puppies/${puppy.id}`}
            className="flex items-center gap-3 rounded-2xl transition hover:bg-cream/60 active:scale-[0.99]"
            aria-label={`View ${puppy.name}'s profile`}
          >
            {puppy.breederPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={puppy.breederPhotoUrl}
                alt={puppy.breederName ?? "Breeder"}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sage/10 text-sm font-semibold text-forest">
                {(puppy.breederName ?? puppy.name).charAt(0)}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold text-forest transition group-hover:text-forest-light">
                {puppy.breederName ?? "Breeder"}
              </p>

              <p className="text-xs text-sage truncate">
                Puppy: {puppy.name}
              </p>

              {puppy.breed && (
                <p className="text-[11px] text-ink/40 truncate">
                  {puppy.breed}
                </p>
              )}
            </div>

            <span className="ml-auto text-xs font-medium text-forest/50">
              View profile
            </span>
          </Link>
        </div>
      </div>

      {/* ===================================================== */}
      {/* LOAD OLDER                                            */}
      {/* ===================================================== */}

      <div className="flex justify-center px-4 py-4">
        {hasMore ? (
          <button
            type="button"
            onClick={() =>
              void loadOlderMessages()
            }
            disabled={isLoadingOlder}
            className="inline-flex items-center gap-2 rounded-full border border-sage/20 bg-white px-4 py-2 text-xs font-medium text-forest transition hover:border-forest/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingOlder ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Loading…
              </>
            ) : (
              "Load older messages"
            )}
          </button>
        ) : messageCount === 0 ? (
          <p className="text-sm text-ink/45">
            Start the conversation.
          </p>
        ) : null}
      </div>

      {/* ===================================================== */}
      {/* MESSAGE LIST                                          */}
      {/* ===================================================== */}

      <div className="flex-1 space-y-4 px-4 pb-6 sm:px-6">
        {messages.map((message) => {
          const isMine =
            currentUserId !== null &&
            message.senderId ===
              currentUserId;

return (
  <div className="flex min-h-[720px] flex-col bg-[#faf9f5]">
    {/* ===================================================== */}
    {/* PREMIUM CHAT HEADER                                   */}
    {/* ===================================================== */}

    <div className="sticky top-0 z-20 border-b border-sage/10 bg-white/95 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <Link
          href="/account/messages"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sage/10 bg-[#faf9f5] text-forest transition hover:bg-cream hover:shadow-sm active:scale-95"
          aria-label="Back to messages"
        >
          <ArrowLeft size={18} strokeWidth={1.7} />
        </Link>

        <Link
          href={`/puppies/${puppy.id}`}
          className="group flex min-w-0 flex-1 items-center gap-3"
          aria-label={`View ${puppy.name}'s profile`}
        >
          <div className="relative h-12 w-12 shrink-0">
            <div className="h-full w-full overflow-hidden rounded-2xl border border-sage/10 bg-cream-alt shadow-sm">
              {puppy.breederPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={puppy.breederPhotoUrl}
                  alt={puppy.breederName ?? "Breeder"}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-forest text-sm font-bold text-cream">
                  {(puppy.breederName ?? puppy.name)
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>

            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#82a67d]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold text-forest sm:text-[15px]">
                {puppy.breederName ?? "Breeder"}
              </p>

              <CheckCheck
                size={14}
                strokeWidth={1.8}
                className="hidden text-sage sm:block"
              />
            </div>

            <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px]">
              <span className="truncate font-medium text-sage">
                {puppy.name}
              </span>

              {puppy.breed && (
                <>
                  <span className="h-1 w-1 shrink-0 rounded-full bg-sage/40" />

                  <span className="truncate text-ink/40">
                    {puppy.breed}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>

        <Link
          href={`/puppies/${puppy.id}`}
          className="hidden h-10 items-center gap-2 rounded-xl border border-sage/10 px-3 text-xs font-semibold text-forest transition hover:border-forest/20 hover:bg-[#faf9f5] sm:inline-flex"
        >
          Puppy profile
          <ExternalLink size={14} />
        </Link>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-sage transition hover:bg-[#faf9f5] sm:hidden"
          aria-label="More conversation options"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Puppy context strip */}
      <Link
        href={`/puppies/${puppy.id}`}
        className="group flex items-center gap-3 border-t border-sage/10 bg-[#fcfbf8] px-4 py-3 transition hover:bg-cream sm:px-6"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
          <PawPrint size={15} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/35">
            Discussing
          </p>

          <p className="mt-0.5 truncate text-xs font-semibold text-forest">
            {puppy.name}
            {puppy.breed ? ` · ${puppy.breed}` : ""}
          </p>
        </div>

        <span className="text-[10px] font-medium text-forest/45 transition group-hover:text-forest">
          View puppy →
        </span>
      </Link>
    </div>

    {/* ===================================================== */}
    {/* LOAD OLDER                                             */}
    {/* ===================================================== */}

    <div className="flex justify-center px-4 py-5">
      {hasMore ? (
        <button
          type="button"
          onClick={() => void loadOlderMessages()}
          disabled={isLoadingOlder}
          className="inline-flex items-center gap-2 rounded-full border border-sage/15 bg-white px-4 py-2 text-[11px] font-semibold text-forest shadow-sm transition hover:border-forest/20 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoadingOlder ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Loading messages…
            </>
          ) : (
            "Load earlier messages"
          )}
        </button>
      ) : messageCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-sage/20 bg-white/70 px-5 py-4 text-center">
          <p className="text-xs font-medium text-ink/45">
            This is the beginning of your conversation about{" "}
            <span className="text-forest">{puppy.name}</span>.
          </p>
        </div>
      ) : null}
    </div>

    {/* ===================================================== */}
    {/* MESSAGE LIST                                           */}
    {/* ===================================================== */}

    <div className="flex-1 px-4 pb-8 sm:px-6 sm:pb-10">
      <div className="mx-auto max-w-3xl space-y-3">
        {messages.map((message, index) => {
          const isMine =
            currentUserId !== null &&
            message.senderId === currentUserId;

          const previousMessage = messages[index - 1];

          const showDate =
            !previousMessage ||
            new Date(
              previousMessage.createdAt
            ).toDateString() !==
              new Date(
                message.createdAt
              ).toDateString();

          return (
            <div key={message.clientGeneratedId}>
              {showDate && (
                <div className="flex items-center gap-3 py-5">
                  <div className="h-px flex-1 bg-sage/10" />

                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-medium text-ink/40 shadow-sm">
                    {new Date(
                      message.createdAt
                    ).toLocaleDateString([], {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  <div className="h-px flex-1 bg-sage/10" />
                </div>
              )}

              <div
                className={`flex ${
                  isMine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {!isMine && (
                  <div className="mr-2 mt-auto flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-forest text-[9px] font-bold text-cream">
                    {puppy.breederPhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={puppy.breederPhotoUrl}
                        alt={puppy.breederName ?? "Breeder"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (puppy.breederName ?? "B")
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>
                )}

                <div
                  className={`group relative max-w-[82%] px-4 py-3 shadow-sm sm:max-w-[70%] ${
                    isMine
                      ? "rounded-[22px] rounded-br-md bg-forest text-cream"
                      : "rounded-[22px] rounded-bl-md border border-sage/10 bg-white text-ink"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm leading-6">
                    {message.content}
                  </p>

                  <div
                    className={`mt-1.5 flex items-center gap-1.5 text-[10px] ${
                      isMine
                        ? "justify-end text-cream/55"
                        : "text-ink/35"
                    }`}
                  >
                    <span>
                      {new Date(
                        message.createdAt
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>

                    {isMine &&
                      message.status === "sending" && (
                        <>
                          <span className="text-cream/30">·</span>
                          <span>Sending</span>
                        </>
                      )}

                    {isMine &&
                      message.status === "sent" && (
                        <CheckCheck
                          size={12}
                          strokeWidth={1.8}
                          className="text-cream/50"
                        />
                      )}

                    {isMine &&
                      message.status === "failed" && (
                        <button
                          type="button"
                          onClick={() =>
                            void retryMessage(message)
                          }
                          disabled={isSending}
                          className="ml-1 inline-flex items-center gap-1 font-semibold text-gold hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <RefreshCw size={10} />
                          Retry
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {otherParticipantTyping && (
          <div className="flex items-end">
            <div className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-forest text-[9px] font-bold text-cream">
              {(puppy.breederName ?? "B")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="rounded-[22px] rounded-bl-md border border-sage/10 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-ink/40">
                  {puppy.breederName ?? "Breeder"} is typing
                </span>

                <span
                  className="flex gap-1"
                  aria-label="Typing"
                >
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest/40 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest/40 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest/40" />
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>

    {/* ===================================================== */}
    {/* COMPOSER                                               */}
    {/* ===================================================== */}

    <div className="sticky bottom-0 z-20 border-t border-sage/10 bg-white/95 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-2 rounded-[24px] border border-sage/15 bg-[#faf9f5] p-1.5 shadow-[0_10px_35px_rgba(39,63,48,0.06)] transition focus-within:border-forest/25 focus-within:bg-white">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);

              if (event.target.value.trim()) {
                handleTyping();
              } else {
                if (typingTimeoutRef.current) {
                  clearTimeout(
                    typingTimeoutRef.current
                  );
                }

                markPresenceActive(false);
              }
            }}
            onFocus={() => markPresenceActive(false)}
            onClick={() => markPresenceActive(false)}
            onTouchStart={() =>
              markPresenceActive(false)
            }
            onKeyDown={handleKeyDown}
            placeholder={`Message ${
              puppy.breederName ?? "breeder"
            } about ${puppy.name}…`}
            rows={1}
            maxLength={5000}
            disabled={isSending}
            className="min-h-[48px] max-h-32 flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-ink outline-none placeholder:text-ink/35 disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() => void submitMessage()}
            disabled={!canSend}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-forest text-cream shadow-sm transition hover:-translate-y-0.5 hover:bg-forest-light hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Send message"
          >
            {isSending ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Send
                size={18}
                strokeWidth={1.8}
                className="translate-x-[1px]"
              />
            )}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between px-2">
          <p className="text-[10px] text-ink/30">
            Press Enter to send · Shift + Enter for a new line
          </p>

          <p className="text-[10px] text-ink/25">
            {input.length}/5000
          </p>
        </div>
      </div>
    </div>
  </div>
);
