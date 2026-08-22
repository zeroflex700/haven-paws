"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Send, Loader2, RefreshCw } from "lucide-react";

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

type ConversationThreadProps = {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
  initialCursor: MessageCursor | null;
  initialHasMore: boolean;
};

const PAGE_SIZE = 30;

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
  currentUserId,
  initialMessages,
  initialCursor,
  initialHasMore,
}: ConversationThreadProps) {
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
      initialCursor
    );

  const [hasMore, setHasMore] =
    useState(initialHasMore);

  const [isLoadingOlder, setIsLoadingOlder] =
    useState(false);

  const [isSending, setIsSending] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);

  /*
   * Tracks both optimistic and persisted message IDs.
   *
   * This prevents the same Realtime event from appearing
   * twice when:
   *
   * 1. we optimistically insert it
   * 2. send_message() returns it
   * 3. Realtime broadcasts it
   */
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

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      bottomRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    },
    []
  );

  useEffect(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  /*
   * Merge one persisted message into local state.
   *
   * The client_generated_id is the most important part
   * for reconciling optimistic messages.
   */
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
   * Live Realtime subscription.
   */
  useEffect(() => {
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
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const incoming =
            mapRealtimeMessage(
              payload.new as RealtimeMessage
            );

          /*
           * Fast duplicate protection.
           */
          if (
            knownMessageIds.current.has(
              incoming.id
            )
          ) {
            return;
          }

          /*
           * A Realtime event for our own optimistic
           * message may arrive before the RPC response.
           *
           * mergePersistedMessage will replace the
           * optimistic copy instead of adding another.
           */
          mergePersistedMessage(incoming);

          if (
            incoming.senderId !==
            currentUserId
          ) {
            scrollToBottom();
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
    mergePersistedMessage,
    scrollToBottom,
  ]);

  /*
   * Load older messages using the cursor from the server.
   */
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

      const page = (await response.json()) as {
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
          current.map((message) => message.id)
        );

        const newMessages =
          page.messages
            .filter(
              (message) =>
                !existingIds.has(message.id)
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

  /*
   * Actually sends a message.
   *
   * This is separated from submitMessage() so retry can
   * use the exact same client-generated UUID.
   */
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

    if (!content || isSending) {
      return;
    }

    const clientGeneratedId =
      createClientMessageId();

    /*
     * Temporary ID is deliberately different from the
     * server UUID.
     *
     * Reconciliation happens through clientGeneratedId.
     */
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
        createdAt: new Date().toISOString(),
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
    if (message.status !== "failed") {
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

    await sendPersistedMessage(
      message.clientGeneratedId,
      message.content
    );
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
    !isSending;

  const messageCount = useMemo(
    () => messages.length,
    [messages.length]
  );

  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col">
      {/* ===================================================== */}
      {/* LOAD OLDER                                             */}
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
      {/* MESSAGE LIST                                           */}
      {/* ===================================================== */}

      <div className="flex-1 space-y-4 px-4 pb-6 sm:px-6">
        {messages.map((message) => {
          const isMine =
            message.senderId ===
            currentUserId;

          return (
            <div
              key={
                message.clientGeneratedId
              }
              className={`flex ${
                isMine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                  isMine
                    ? "rounded-br-md bg-forest text-cream"
                    : "rounded-bl-md border border-sage/10 bg-white text-ink"
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                  {message.content}
                </p>

                <div
                  className={`mt-1.5 flex items-center gap-2 text-[10px] ${
                    isMine
                      ? "text-cream/60"
                      : "text-ink/40"
                  }`}
                >
                  <span>
                    {new Date(
                      message.createdAt
                    ).toLocaleTimeString(
                      [],
                      {
                        hour: "numeric",
                        minute: "2-digit",
                      }
                    )}
                  </span>

                  {isMine &&
                    message.status ===
                      "sending" && (
                      <span>
                        Sending…
                      </span>
                    )}

                  {isMine &&
                    message.status ===
                      "failed" && (
                      <button
                        type="button"
                        onClick={() =>
                          void retryMessage(
                            message
                          )
                        }
                        className="inline-flex items-center gap-1 font-medium text-gold hover:underline"
                      >
                        <RefreshCw
                          size={11}
                        />
                        Retry
                      </button>
                    )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* ===================================================== */}
      {/* COMPOSER                                               */}
      {/* ===================================================== */}

      <div className="sticky bottom-0 border-t border-sage/10 bg-cream/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-4xl items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value
              )
            }
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