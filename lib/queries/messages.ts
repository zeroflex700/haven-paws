import { createClient } from "@/lib/supabase/server";

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: "customer" | "admin";
  content: string;
  clientGeneratedId: string;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
};

export type MessageCursor = {
  createdAt: string;
  id: string;
};

export type MessagePage = {
  messages: Message[];
  nextCursor: MessageCursor | null;
  hasMore: boolean;
};

const DEFAULT_PAGE_SIZE = 30;
const MAX_PAGE_SIZE = 100;

type RawMessage = {
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
  message: RawMessage
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

/**
 * Loads one page of messages for a customer conversation.
 *
 * Security is enforced twice:
 * 1. The conversation must belong to the authenticated customer.
 * 2. Database RLS independently protects message access.
 *
 * Pagination uses the existing composite index:
 * conversation_id, created_at DESC, id DESC
 */
export async function getCustomerMessages(
  conversationId: string,
  options?: {
    cursor?: MessageCursor | null;
    limit?: number;
  }
): Promise<MessagePage | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  /*
   * Never trust the conversation ID from the URL by itself.
   *
   * Confirm this conversation belongs to the currently
   * authenticated customer before loading its history.
   */
  const {
    data: conversation,
    error: conversationError,
  } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (conversationError) {
    console.error(
      "Failed to verify customer conversation:",
      conversationError
    );

    return null;
  }

  if (!conversation) {
    return null;
  }

  const requestedLimit =
    options?.limit ?? DEFAULT_PAGE_SIZE;

  const limit = Math.min(
    Math.max(requestedLimit, 1),
    MAX_PAGE_SIZE
  );

  /*
   * Request one extra message so we can determine whether
   * another older page exists without running a COUNT query.
   */
  const fetchLimit = limit + 1;

  let query = supabase
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
    .eq("conversation_id", conversationId)
    .order("created_at", {
      ascending: false,
    })
    .order("id", {
      ascending: false,
    })
    .limit(fetchLimit);

  /*
   * Keyset cursor.
   *
   * We need:
   *
   * created_at < cursor.createdAt
   *
   * OR
   *
   * created_at = cursor.createdAt
   * AND id < cursor.id
   *
   * because created_at alone is not guaranteed unique.
   */
  if (options?.cursor) {
    const {
      createdAt,
      id,
    } = options.cursor;

    query = query.or(
      [
        `created_at.lt.${createdAt}`,
        `and(created_at.eq.${createdAt},id.lt.${id})`,
      ].join(",")
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      "Failed to load messages:",
      error
    );

    return null;
  }

  const rawMessages =
    (data ?? []) as RawMessage[];

  const hasMore =
    rawMessages.length > limit;

  /*
   * Remove the extra row used only to determine hasMore.
   */
  const pageRows = hasMore
    ? rawMessages.slice(0, limit)
    : rawMessages;

  /*
   * Supabase returned newest → oldest.
   *
   * Reverse before returning so the UI receives:
   * oldest → newest
   *
   * This gives the chat a natural chronological display.
   */
  const messages = pageRows
    .map(mapMessage)
    .reverse();

  /*
   * The next "older messages" cursor is the oldest
   * message currently loaded.
   */
  const oldestMessage =
    pageRows[pageRows.length - 1];

  const nextCursor =
    hasMore && oldestMessage
      ? {
          createdAt:
            oldestMessage.created_at,
          id: oldestMessage.id,
        }
      : null;

  return {
    messages,
    nextCursor,
    hasMore,
  };
}