import Link from "next/link";
import { redirect } from "next/navigation";
import {
  MessageSquare,
  ChevronRight,
  PawPrint,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type ConversationRow = {
  id: string;
  customer_id: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  last_message_sender_role:
    | "customer"
    | "admin"
    | null;
  created_at: string;

  puppies:
    | {
        id: string;
        name: string;
        image: string | null;
      }
    | {
        id: string;
        name: string;
        image: string | null;
      }[]
    | null;

  customer_profiles:
    | {
        first_name: string | null;
        last_name: string | null;
        avatar_url: string | null;
      }
    | {
        first_name: string | null;
        last_name: string | null;
        avatar_url: string | null;
      }[]
    | null;
};

type ParticipantRow = {
  conversation_id: string;
  last_read_at: string | null;
  last_read_message_id: string | null;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: "customer" | "admin";
  created_at: string;
};

function getSingleRelation<T>(
  relation: T | T[] | null
): T | null {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}

function getCustomerName(
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null
) {
  if (!profile) {
    return "Customer";
  }

  const name = [
    profile.first_name?.trim(),
    profile.last_name?.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  return name || "Customer";
}

function formatConversationTime(
  value: string | null
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const now = new Date();

  const isToday =
    date.toDateString() ===
    now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(
    now.getDate() - 1
  );

  if (
    date.toDateString() ===
    yesterday.toDateString()
  ) {
    return "Yesterday";
  }

  if (
    date.getFullYear() ===
    now.getFullYear()
  ) {
    return date.toLocaleDateString(
      [],
      {
        month: "short",
        day: "numeric",
      }
    );
  }

  return date.toLocaleDateString(
    [],
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  /*
   * Do a real server-side admin check.
   *
   * The middleware currently confirms only that a user
   * is logged in. This prevents an ordinary customer from
   * directly visiting /admin/messages.
   */
  const { data: adminRecord } =
    await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

  if (!adminRecord) {
    redirect("/admin/login");
  }

  /*
   * Fetch the inbox conversations.
   *
   * The puppy relationship comes from conversations.puppy_id.
   * The customer profile relationship comes from
   * conversations.customer_id -> customer_profiles.id.
   */
  const { data, error } =
    await supabase
      .from("conversations")
      .select(
        `
          id,
          customer_id,
          last_message_at,
          last_message_preview,
          last_message_sender_role,
          created_at,
          puppies (
            id,
            name,
            image
          ),
          customer_profiles (
            first_name,
            last_name,
            avatar_url
          )
        `
      )
      .order("last_message_at", {
        ascending: false,
        nullsFirst: false,
      });

  if (error) {
  console.error(
    "Failed to load admin conversations:",
    error
  );
}

  const conversations =
    (data ?? []) as ConversationRow[];

  /*
   * Get this admin's read state for all inbox conversations.
   *
   * We deliberately fetch only the current admin's participant
   * record. An admin does not need to have opened every
   * conversation yet, so some conversations may have no record.
   */
  const { data: participantData } =
    await supabase
      .from("conversation_participants")
      .select(
        `
          conversation_id,
          last_read_at,
          last_read_message_id
        `
      )
      .eq("user_id", user.id);

  const participantRows =
    (participantData ?? []) as ParticipantRow[];

  const participantByConversation =
    new Map(
      participantRows.map((participant) => [
        participant.conversation_id,
        participant,
      ])
    );

  /*
   * Fetch customer messages once so we can calculate
   * unread counts for the inbox.
   *
   * A message is unread when:
   * - it was sent by a customer
   * - and it was sent after this admin's last_read_at
   *
   * If the admin has never opened the conversation,
   * every customer message is considered unread.
   */
  const conversationIds =
    conversations.map(
      (conversation) => conversation.id
    );

  let messages: MessageRow[] = [];

  if (conversationIds.length > 0) {
    const {
      data: messageData,
      error: messagesError,
    } = await supabase
      .from("messages")
      .select(
        `
          id,
          conversation_id,
          sender_id,
          sender_role,
          created_at
        `
      )
      .in(
        "conversation_id",
        conversationIds
      )
      .eq("sender_role", "customer")
      .is("deleted_at", null);

    if (messagesError) {
      console.error(
        "Failed to load unread message data:",
        messagesError
      );
    } else {
      messages =
        (messageData ?? []) as MessageRow[];
    }
  }

  const unreadCounts = new Map<
    string,
    number
  >();

  for (const message of messages) {
    const participant =
      participantByConversation.get(
        message.conversation_id
      );

    const lastReadAt =
      participant?.last_read_at;

    const isUnread =
      !lastReadAt ||
      new Date(message.created_at).getTime() >
        new Date(lastReadAt).getTime();

    if (isUnread) {
      unreadCounts.set(
        message.conversation_id,
        (unreadCounts.get(
          message.conversation_id
        ) ?? 0) + 1
      );
    }
  }

  return (
    <main className="min-h-screen pb-28">
      {/* ===================================================== */}
      {/* HEADER                                                */}
      {/* ===================================================== */}

      <div className="border-b border-sage/10 bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/40">
            Customer communication
          </p>

          <div className="mt-2 flex items-center gap-3">
            <MessageSquare
              size={28}
              strokeWidth={1.5}
              className="text-forest"
            />

            <div>
              <h1 className="font-serif text-3xl text-forest">
                Messages
              </h1>

              <p className="mt-1 text-sm text-ink/50">
                {conversations.length === 1
                  ? "1 conversation"
                  : `${conversations.length} conversations`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* INBOX                                                 */}
      {/* ===================================================== */}

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        {conversations.length === 0 ? (
          <div className="rounded-3xl border border-sage/10 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/10">
              <MessageSquare
                size={24}
                strokeWidth={1.5}
                className="text-forest"
              />
            </div>

            <h2 className="mt-5 font-serif text-xl text-forest">
              No conversations yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink/50">
              Customer conversations about puppies
              will appear here when they start
              messaging.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-sage/10 bg-white">
            {conversations.map(
              (conversation) => {
                const puppy =
                  getSingleRelation(
                    conversation.puppies
                  );

                const profile =
                  getSingleRelation(
                    conversation.customer_profiles
                  );

                const customerName =
                  getCustomerName(profile);

                const unreadCount =
                  unreadCounts.get(
                    conversation.id
                  ) ?? 0;

                const hasUnread =
                  unreadCount > 0;

                const previewPrefix =
                  conversation.last_message_sender_role ===
                  "admin"
                    ? "You: "
                    : "";

                return (
                  <Link
                    key={conversation.id}
                    href={`/admin/messages/${conversation.id}`}
                    className="group flex items-center gap-3 border-b border-sage/10 px-4 py-4 transition last:border-b-0 hover:bg-sage/[0.04] sm:px-5"
                  >
                    {/* Customer avatar */}

                    {profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt={customerName}
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-cream">
                        {customerName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    {/* Conversation information */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p
                            className={`truncate text-sm ${
                              hasUnread
                                ? "font-semibold text-forest"
                                : "font-medium text-ink"
                            }`}
                          >
                            {customerName}
                          </p>

                          {puppy && (
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-ink/45">
                              <PawPrint
                                size={12}
                                strokeWidth={1.5}
                              />

                              <span className="truncate">
                                About{" "}
                                {puppy.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {conversation.last_message_at && (
                          <span
                            className={`shrink-0 text-[11px] ${
                              hasUnread
                                ? "font-semibold text-forest"
                                : "text-ink/40"
                            }`}
                          >
                            {formatConversationTime(
                              conversation.last_message_at
                            )}
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
                          {conversation.last_message_preview
                            ? `${previewPrefix}${conversation.last_message_preview}`
                            : "No messages yet"}
                        </p>

                        {hasUnread && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-forest px-1.5 text-[10px] font-semibold text-cream">
                            {unreadCount > 99
                              ? "99+"
                              : unreadCount}
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
                );
              }
            )}
          </div>
        )}
      </div>
    </main>
  );
}