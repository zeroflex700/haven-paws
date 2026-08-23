import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type {
  Message,
  MessageCursor,
} from "@/lib/queries/messages";
import ConversationThread from "@/app/components/messages/ConversationThread";

const PAGE_SIZE = 30;

type PageProps = {
  params: Promise<{
    conversationId: string;
  }>;
};

type ConversationRow = {
  id: string;
  puppy_id: string;
  customer_id: string;
  status: "open" | "closed";
  created_at: string;
};

type PuppyRow = {
  id: string;
  name: string;
  image: string | null;
};

type MessageRow = {
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

function mapMessage(
  message: MessageRow
): Message {
  return {
    id: message.id,
    conversationId:
      message.conversation_id,
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

export default async function AdminConversationPage({
  params,
}: PageProps) {
  const { conversationId } =
    await params;

  const supabase =
    await createClient();

  /* ========================================================= */
  /* AUTHENTICATION                                             */
  /* ========================================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  /*
   * Middleware currently checks whether the user is logged in.
   *
   * This server-side check additionally confirms that the user
   * is genuinely an administrator.
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

  /* ========================================================= */
  /* CONVERSATION                                               */
  /* ========================================================= */

  const {
    data: conversationData,
    error: conversationError,
  } = await supabase
    .from("conversations")
    .select(
      `
        id,
        puppy_id,
        customer_id,
        status,
        created_at
      `
    )
    .eq("id", conversationId)
    .maybeSingle();

  if (
    conversationError ||
    !conversationData
  ) {
    redirect("/admin/messages");
  }

  const conversation =
    conversationData as ConversationRow;

  /* ========================================================= */
  /* PUPPY                                                      */
  /* ========================================================= */

  const {
    data: puppyData,
    error: puppyError,
  } = await supabase
    .from("puppies")
    .select(
      `
        id,
        name,
        image
      `
    )
    .eq("id", conversation.puppy_id)
    .maybeSingle();

  if (puppyError || !puppyData) {
    redirect("/admin/messages");
  }

  const puppy =
    puppyData as PuppyRow;

  /* ========================================================= */
  /* INITIAL MESSAGE PAGE                                       */
  /* ========================================================= */

  /*
   * Fetch one extra message.
   *
   * This lets us determine whether there are older messages
   * without needing a separate count query.
   */
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
        content,
        client_generated_id,
        created_at,
        edited_at,
        deleted_at
      `
    )
    .eq(
      "conversation_id",
      conversationId
    )
    .is("deleted_at", null)
    .order("created_at", {
      ascending: false,
    })
    .order("id", {
      ascending: false,
    })
    .limit(PAGE_SIZE + 1);

  if (messagesError) {
    console.error(
      "Failed to load admin messages:",
      messagesError
    );
  }

  const rawMessages =
    (messageData ?? []) as MessageRow[];

  const hasMore =
    rawMessages.length > PAGE_SIZE;

  /*
   * Remove the extra row used for pagination detection.
   *
   * Messages are then reversed because the UI renders them
   * oldest → newest.
   */
  const pageMessages =
    rawMessages
      .slice(0, PAGE_SIZE)
      .reverse();

  const initialMessages =
    pageMessages.map(mapMessage);

  const oldestMessage =
    pageMessages[0] ?? null;

  const initialNextCursor:
    | MessageCursor
    | null = hasMore &&
    oldestMessage
      ? {
          createdAt:
            oldestMessage.created_at,
          id: oldestMessage.id,
        }
      : null;

  /* ========================================================= */
  /* THREAD                                                     */
  /* ========================================================= */

  return (
    <ConversationThread
      conversationId={conversationId}
      puppy={{
        id: puppy.id,
        name: puppy.name,
        image: puppy.image,
      }}
      initialMessages={initialMessages}
      initialNextCursor={
        initialNextCursor
      }
      initialHasMore={hasMore}
    />
  );
}