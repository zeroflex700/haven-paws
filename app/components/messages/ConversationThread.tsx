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
};

type ConversationThreadProps = {
  conversationId: string;
  puppy: Puppy;
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

  // Resolve the current user client-side rather than requiring the
  // caller to pass it in — keeps this component self-contained and
  // avoids coupling it to how the parent page fetches auth state.
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
   * Conversation Presence
   *
   * This channel is separate from database Realtime.
   *
   * Presence is ephemeral:
   * - no database writes
   * - no stale "online" rows
   * - automatically disappears when the connection closes
   *
   * The future admin conversation UI will join this exact
   * same channel and immediately know whether the customer
   * is online and active.
   */
  useEffect(() => {
    if (!currentUserId) return;

    const channelName =
      `conversation-presence:${conversationId}`;

    const channel = supabase.channel(
      channelName,
      {
        config: {
          presence: {
            key: currentUserId,
          },
        },
      }
    );

    presenceChannelRef.current = channel;

    function updateRemotePresence() {
      const state = channel.presenceState<
        PresenceUser
      >();

      const remoteStates =
        Object.values(state)
          .flat()
          .filter(
            (presence) =>
              presence.userId !== currentUserId
          );

      setOtherParticipantTyping(
        remoteStates.some(
          (presence) => presence.typing
        )
      );
    }

    channel
      .on(
        "presence",
        {
          event: "sync",
        },
        updateRemotePresence
      )
      .on(
        "presence",
        {
          event: "join",
        },
        updateRemotePresence
      )
      .on(
        "presence",
        {
          event: "leave",
        },
        updateRemotePresence
      )
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }

        await channel.track({
          userId: currentUserId,
          role: "customer",
          typing: false,
          lastActiveAt: new Date().toISOString(),
        } satisfies PresenceUser);

        lastActivityRef.current = Date.now();
      });

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(
          typingTimeoutRef.current
        );
      }

      presenceChannelRef.current = null;

      void supabase.removeChannel(channel);
    };
  }, [
    conversationId,
    currentUserId,
  ]);

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

      /*
       * Avoid sending unnecessary activity updates.
       *
       * Typing changes are always sent immediately.
       * General activity is throttled.
       */
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
        role: "customer",
        typing,
        lastActiveAt: new Date().toISOString(),
      } satisfies PresenceUser);
    },
    [currentUserId]
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

      const response = await fetch(
        `/api/messages/${conversationId}?${params.toString()}`
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
        senderRole: "customer",
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
            {puppy.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={puppy.image}
                alt={puppy.name}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sage/10 text-sm font-semibold text-forest">
                {puppy.name.charAt(0)}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs text-ink/45">
                Conversation about
              </p>

              <p className="text-sm font-semibold text-forest transition group-hover:text-forest-light">
                {puppy.name}
              </p>
            </div>

            <span className="ml-auto text-xs font-medium text-forest/50">
              View profile
            </span>
          </Link>
        </div>
      </div>

        {otherParticipantTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-sage/10 bg-white px-4 py-3 text-xs text-ink/50 shadow-sm">
              <div className="flex items-center gap-2">
                <span>Typing</span>

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

      {/* ===================================================== */}
      {/* COMPOSER                                              */}
      {/* ===================================================== */}

      <div className="sticky bottom-0 border-t border-sage/10 bg-cream/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-4xl items-end gap-3">
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
            onTouchStart={() => markPresenceActive(false)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message…"
            rows={1}
            maxLength={5000}
            disabled={isSending}
            className="min-h-[48px] flex-1 resize-none rounded-2xl border border-sage/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-forest/30 focus:ring-2 focus:ring-forest/5 disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() =>
              void submitMessage()
            }
            disabled={!canSend}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-cream transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            {isSending ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>

        <p className="mx-auto mt-2 max-w-4xl text-[10px] text-ink/35">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </div>
    </div>
  );
}