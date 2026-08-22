"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Send,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";

import type {
  Message,
  OptimisticMessage,
  PuppyConversationContext,
} from "@/lib/types/messaging";

type Props = {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
  puppy: PuppyConversationContext;
  conversationStatus: "open" | "closed";
};

function createClientMessageId() {
  return crypto.randomUUID();
}

function formatMessageTime(
  value: string
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

function getErrorMessage(
  error: unknown
) {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Something went wrong.";
}

export default function ConversationThread({
  conversationId,
  currentUserId,
  initialMessages,
  puppy,
  conversationStatus,
}: Props) {
  const [messages, setMessages] =
    useState<OptimisticMessage[]>(
      initialMessages.map((message) => ({
        ...message,
        status: "sent",
      }))
    );

  const [content, setContent] =
    useState("");

  const [isSending, setIsSending] =
    useState(false);

  const [connectionState, setConnectionState] =
    useState<
      "connecting" | "connected" | "error"
    >("connecting");

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * Keeps track of messages already handled by either:
   *
   * 1. optimistic RPC reconciliation
   * 2. Realtime
   *
   * This prevents the classic:
   *
   * optimistic message
   *       +
   * RPC response
   *       +
   * Realtime event
   *
   * = three copies
   *
   * bug.
   */
  const seenClientIdsRef =
    useRef<Set<string>>(
      new Set(
        initialMessages.map(
          (message) =>
            message.client_generated_id
        )
      )
    );

  const messageIdsRef =
    useRef<Set<string>>(
      new Set(
        initialMessages.map(
          (message) => message.id
        )
      )
    );

  const isOpen =
    conversationStatus === "open";

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const dateDifference =
        new Date(
          a.created_at
        ).getTime() -
        new Date(
          b.created_at
        ).getTime();

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return a.id.localeCompare(b.id);
    });
  }, [messages]);

  function scrollToBottom(
    behavior: ScrollBehavior = "smooth"
  ) {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    });
  }

  /*
   * Mark the thread as read.
   *
   * The secure database RPC updates only the authenticated user's
   * participant row.
   */
  async function markAsRead() {
    const { error } =
      await supabase.rpc(
        "mark_conversation_read",
        {
          p_conversation_id:
            conversationId,
        }
      );

    if (error) {
      console.error(
        "Failed to mark conversation as read:",
        error
      );
    }
  }

  useEffect(() => {
    void markAsRead();

    scrollToBottom("auto");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    const channel =
      supabase
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
              payload.new as Message;

            /*
             * Ignore malformed events.
             */
            if (
              !incoming ||
              !incoming.id ||
              !incoming.client_generated_id
            ) {
              return;
            }

            /*
             * Already received through RPC or a previous
             * Realtime event.
             */
            if (
              messageIdsRef.current.has(
                incoming.id
              )
            ) {
              return;
            }

            messageIdsRef.current.add(
              incoming.id
            );

            seenClientIdsRef.current.add(
              incoming.client_generated_id
            );

            setMessages((current) => {
              /*
               * If this Realtime event is the confirmation of
               * our optimistic message, replace it rather than
               * appending another bubble.
               */
              const optimisticIndex =
                current.findIndex(
                  (message) =>
                    message.client_generated_id ===
                    incoming.client_generated_id
                );

              if (optimisticIndex >= 0) {
                const next = [...current];

                next[optimisticIndex] = {
                  ...incoming,
                  status: "sent",
                };

                return next;
              }

              return [
                ...current,
                {
                  ...incoming,
                  status: "sent",
                },
              ];
            });

            /*
             * If a new message arrives while this thread is open,
             * mark it as read for the active participant.
             */
            if (
              incoming.sender_id !==
              currentUserId
            ) {
              void markAsRead();
            }

            scrollToBottom();
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setConnectionState(
              "connected"
            );

            return;
          }

          if (
            status === "CHANNEL_ERROR" ||
            status === "TIMED_OUT"
          ) {
            setConnectionState("error");

            return;
          }

          setConnectionState(
            "connecting"
          );
        });

    return () => {
      void supabase.removeChannel(
        channel
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    conversationId,
    currentUserId,
  ]);

  async function fetchExistingMessage(
    clientGeneratedId: string
  ) {
    const { data, error } =
      await supabase
        .from("messages")
        .select(`
          id,
          conversation_id,
          sender_id,
          sender_role,
          content,
          client_generated_id,
          attachment_url,
          attachment_type,
          edited_at,
          deleted_at,
          created_at
        `)
        .eq(
          "conversation_id",
          conversationId
        )
        .eq(
          "client_generated_id",
          clientGeneratedId
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data as Message | null;
  }

  function confirmMessage(
    clientGeneratedId: string,
    confirmed: Message
  ) {
    messageIdsRef.current.add(
      confirmed.id
    );

    seenClientIdsRef.current.add(
      clientGeneratedId
    );

    setMessages((current) =>
      current.map((message) => {
        if (
          message.client_generated_id !==
          clientGeneratedId
        ) {
          return message;
        }

        return {
          ...confirmed,
          status: "sent",
        };
      })
    );
  }

  async function sendMessage(
    messageContent: string,
    existingClientGeneratedId?: string
  ) {
    const trimmed =
      messageContent.trim();

    if (!trimmed || !isOpen) {
      return;
    }

    const clientGeneratedId =
      existingClientGeneratedId ??
      createClientMessageId();

    const existingOptimistic =
      messages.find(
        (message) =>
          message.client_generated_id ===
          clientGeneratedId
      );

    if (!existingOptimistic) {
      const optimisticMessage:
        OptimisticMessage = {
          id:
            `optimistic-${clientGeneratedId}`,
          conversation_id:
            conversationId,
          sender_id: currentUserId,
          sender_role: "customer",
          content: trimmed,
          client_generated_id:
            clientGeneratedId,
          attachment_url: null,
          attachment_type: null,
          edited_at: null,
          deleted_at: null,
          created_at:
            new Date().toISOString(),
          status: "sending",
        };

      seenClientIdsRef.current.add(
        clientGeneratedId
      );

      setMessages((current) => [
        ...current,
        optimisticMessage,
      ]);
    } else {
      setMessages((current) =>
        current.map((message) =>
          message.client_generated_id ===
          clientGeneratedId
            ? {
                ...message,
                status: "sending",
              }
            : message
        )
      );
    }

    setIsSending(true);

    try {
      const { data, error } =
        await supabase.rpc(
          "send_message",
          {
            p_conversation_id:
              conversationId,
            p_content: trimmed,
            p_client_generated_id:
              clientGeneratedId,
          }
        );

      if (error) {
        throw error;
      }

      /*
       * Depending on the exact PostgREST representation of a
       * composite return value, normalize either object or array.
       */
      const returnedMessage =
        Array.isArray(data)
          ? data[0]
          : data;

      if (
        returnedMessage &&
        typeof returnedMessage ===
          "object" &&
        "id" in returnedMessage
      ) {
        confirmMessage(
          clientGeneratedId,
          returnedMessage as Message
        );
      } else {
        /*
         * Important idempotency fallback:
         *
         * If the database already processed this client-generated
         * ID but the RPC response is empty, retrieve the persisted
         * message and reconcile the optimistic bubble.
         */
        const existing =
          await fetchExistingMessage(
            clientGeneratedId
          );

        if (!existing) {
          throw new Error(
            "The message could not be confirmed."
          );
        }

        confirmMessage(
          clientGeneratedId,
          existing
        );
      }

      void markAsRead();

      scrollToBottom();

      setContent("");
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

      setMessages((current) =>
        current.map((message) =>
          message.client_generated_id ===
          clientGeneratedId
            ? {
                ...message,
                status: "failed",
              }
            : message
        )
      );
    } finally {
      setIsSending(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !content.trim() ||
      isSending ||
      !isOpen
    ) {
      return;
    }

    await sendMessage(content);
  }

  async function retryMessage(
    message: OptimisticMessage
  ) {
    if (isSending) {
      return;
    }

    await sendMessage(
      message.content,
      message.client_generated_id
    );
  }

  return (
    <div className="flex flex-col">

      {/* ---------------------------------------------------- */}
      {/* Puppy context — intentionally compact               */}
      {/* ---------------------------------------------------- */}

      <div className="px-4 sm:px-6 py-3 border-b border-sage/10 bg-cream-alt/30">

        <div className="flex items-center gap-3">

          <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-cream border border-sage/10 shrink-0">

            {puppy.coverImage ? (
              <Image
                src={puppy.coverImage}
                alt={puppy.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-sage">
                🐾
              </div>
            )}

          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-medium text-forest truncate">
              {puppy.name}
            </p>

            <p className="text-xs text-ink/55 truncate">
              {puppy.breed}
            </p>

          </div>

          <Link
            href={`/puppies/${puppy.id}`}
            className="text-xs font-medium text-forest hover:text-forest-light transition-colors shrink-0"
          >
            View listing
          </Link>

        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* Connection status                                    */}
      {/* ---------------------------------------------------- */}

      {connectionState === "error" && (
        <div className="mx-4 sm:mx-6 mt-3 flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-3 py-2.5">

          <AlertCircle
            size={15}
            className="text-forest shrink-0"
          />

          <p className="text-xs text-ink/70">
            Live updates are reconnecting. Your
            messages can still be sent securely.
          </p>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Message history                                       */}
      {/* ---------------------------------------------------- */}

      <div className="h-[min(58vh,620px)] min-h-[380px] overflow-y-auto px-4 sm:px-6 py-5 space-y-3">

        {sortedMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">

            <div className="h-11 w-11 rounded-xl bg-cream-alt border border-sage/10 flex items-center justify-center text-xl mb-3">
              🐾
            </div>

            <p className="text-sm font-medium text-forest">
              Start the conversation
            </p>

            <p className="text-xs text-ink/55 leading-5 mt-1.5 max-w-xs">
              Ask the breeder anything you&apos;d like
              to know about {puppy.name}.
            </p>

          </div>
        )}

        {sortedMessages.map((message) => {
          const isMine =
            message.sender_id ===
            currentUserId;

          return (
            <div
              key={
                message.id.startsWith(
                  "optimistic-"
                )
                  ? message.client_generated_id
                  : message.id
              }
              className={`flex ${
                isMine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div className="max-w-[82%] sm:max-w-[70%]">

                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                    isMine
                      ? "bg-forest text-cream rounded-br-md"
                      : "bg-cream-alt text-ink rounded-bl-md border border-sage/10"
                  }`}
                >
                  {message.content}
                </div>

                <div
                  className={`mt-1 flex items-center gap-2 text-[10px] ${
                    isMine
                      ? "justify-end text-ink/40"
                      : "justify-start text-ink/40"
                  }`}
                >

                  <span>
                    {formatMessageTime(
                      message.created_at
                    )}
                  </span>

                  {message.status ===
                    "sending" && (
                    <span className="inline-flex items-center gap-1">
                      <Loader2
                        size={10}
                        className="animate-spin"
                      />
                      Sending
                    </span>
                  )}

                  {message.status ===
                    "failed" && (
                    <button
                      type="button"
                      onClick={() =>
                        retryMessage(
                          message
                        )
                      }
                      disabled={isSending}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw
                        size={10}
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

      {/* ---------------------------------------------------- */}
      {/* Closed conversation notice                            */}
      {/* ---------------------------------------------------- */}

      {!isOpen && (
        <div className="border-t border-sage/10 px-4 sm:px-6 py-4 bg-cream-alt/30">

          <p className="text-sm text-ink/60 text-center">
            This conversation has been closed.
          </p>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Composer                                              */}
      {/* ---------------------------------------------------- */}

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="border-t border-sage/10 p-3 sm:p-4 bg-white"
        >

          <div className="flex items-end gap-2">

            <textarea
              value={content}
              onChange={(event) =>
                setContent(
                  event.target.value
                )
              }
              placeholder={`Message ${
                puppy.breederName ??
                "the breeder"
              }...`}
              rows={1}
              maxLength={4000}
              disabled={isSending}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  if (
                    content.trim() &&
                    !isSending
                  ) {
                    void sendMessage(
                      content
                    );
                  }
                }
              }}
              className="flex-1 resize-none rounded-xl border border-sage/15 bg-cream-alt/35 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-forest/30 focus:ring-2 focus:ring-forest/5 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={
                !content.trim() ||
                isSending
              }
              aria-label="Send message"
              className="h-11 w-11 rounded-xl bg-forest text-cream flex items-center justify-center hover:bg-forest-light transition-colors disabled:cursor-not-allowed disabled:opacity-45 shrink-0"
            >

              {isSending ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Send
                  size={17}
                  strokeWidth={1.8}
                />
              )}

            </button>

          </div>

          <div className="flex items-center justify-between gap-4 mt-2 px-1">

            <p className="text-[10px] text-ink/40">
              Press Enter to send
            </p>

            {connectionState ===
            "connected" ? (
              <p className="text-[10px] text-ink/40">
                Live conversation
              </p>
            ) : (
              <p className="text-[10px] text-ink/40">
                Connecting...
              </p>
            )}

          </div>

        </form>
      )}

    </div>
  );
}