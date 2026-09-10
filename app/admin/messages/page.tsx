import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import AdminInboxRealtime from "@/app/admin/components/messages/AdminInboxRealtime";
import AdminInboxList, {
  type AdminConversationItem,
} from "@/app/admin/components/messages/AdminInboxList";

import { createClient } from "@/lib/supabase/server";

type ConversationRow = {
  id: string;
  customer_id: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  last_message_sender_role: "customer" | "admin" | null;
  archived_at: string | null;
  created_at: string;

  puppies:
    | { id: string; name: string }
    | { id: string; name: string }[]
    | null;

  customer_profiles:
    | { first_name: string | null; last_name: string | null; avatar_url: string | null }
    | { first_name: string | null; last_name: string | null; avatar_url: string | null }[]
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

function getSingleRelation<T>(relation: T | T[] | null): T | null {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }
  return relation;
}

function getCustomerName(
  profile: { first_name: string | null; last_name: string | null } | null
) {
  if (!profile) return "Customer";

  const name = [profile.first_name?.trim(), profile.last_name?.trim()]
    .filter(Boolean)
    .join(" ");

  return name || "Customer";
}

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRecord) {
    redirect("/admin/login");
  }

  const { data, error } = await supabase
    .from("conversations")
    .select(
      `
        id,
        customer_id,
        last_message_at,
        last_message_preview,
        last_message_sender_role,
        archived_at,
        created_at,
        puppies (
          id,
          name
        ),
        customer_profiles (
          first_name,
          last_name,
          avatar_url
        )
      `
    )
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Failed to load admin conversations:", error);
  }

  const conversations = (data ?? []) as ConversationRow[];

  const { data: participantData } = await supabase
    .from("conversation_participants")
    .select(`conversation_id, last_read_at, last_read_message_id`)
    .eq("user_id", user.id);

  const participantRows = (participantData ?? []) as ParticipantRow[];

  const participantByConversation = new Map(
    participantRows.map((p) => [p.conversation_id, p])
  );

  const conversationIds = conversations.map((c) => c.id);

  let messages: MessageRow[] = [];

  if (conversationIds.length > 0) {
    const { data: messageData, error: messagesError } = await supabase
      .from("messages")
      .select(`id, conversation_id, sender_id, sender_role, created_at`)
      .in("conversation_id", conversationIds)
      .eq("sender_role", "customer")
      .is("deleted_at", null);

    if (messagesError) {
      console.error("Failed to load unread message data:", messagesError);
    } else {
      messages = (messageData ?? []) as MessageRow[];
    }
  }

  const unreadCounts = new Map<string, number>();

  for (const message of messages) {
    const participant = participantByConversation.get(message.conversation_id);
    const lastReadAt = participant?.last_read_at;

    const isUnread =
      !lastReadAt ||
      new Date(message.created_at).getTime() > new Date(lastReadAt).getTime();

    if (isUnread) {
      unreadCounts.set(
        message.conversation_id,
        (unreadCounts.get(message.conversation_id) ?? 0) + 1
      );
    }
  }

  const items: AdminConversationItem[] = conversations.map((conversation) => {
    const puppy = getSingleRelation(conversation.puppies);
    const profile = getSingleRelation(conversation.customer_profiles);

    return {
      id: conversation.id,
      customerName: getCustomerName(profile),
      customerAvatarUrl: profile?.avatar_url ?? null,
      puppyName: puppy?.name ?? null,
      lastMessageAt: conversation.last_message_at,
      lastMessagePreview: conversation.last_message_preview,
      lastMessageSenderRole: conversation.last_message_sender_role,
      unreadCount: unreadCounts.get(conversation.id) ?? 0,
      isArchived: !!conversation.archived_at,
    };
  });

  return (
    <main className="min-h-screen pb-28">
      <AdminInboxRealtime />

      <div className="border-b border-sage/10 bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/40">
            Customer communication
          </p>

          <div className="mt-2 flex items-center gap-3">
            <MessageSquare size={28} strokeWidth={1.5} className="text-forest" />

            <div>
              <h1 className="font-serif text-3xl text-forest">Messages</h1>

              <p className="mt-1 text-sm text-ink/50">
                {items.length === 1
                  ? "1 conversation"
                  : `${items.length} conversations`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        <AdminInboxList conversations={items} />
      </div>
    </main>
  );
}