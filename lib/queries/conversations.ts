import { createClient } from "@/lib/supabase/server";

export type ConversationListItem = {
  id: string;
  status: "open" | "closed";

  puppy: {
    id: string;
    name: string;
    breed: string;
    breederName: string | null;
    imageUrl: string | null;
  };

  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  lastMessageSenderRole: "customer" | "admin" | null;

  createdAt: string;

  hasUnread: boolean;
  unreadCount: number;
};

type RawConversation = {
  id: string;
  status: "open" | "closed";
  last_message_at: string | null;
  last_message_preview: string | null;
  last_message_sender_role: "customer" | "admin" | null;
  created_at: string;

  puppy: {
    id: string;
    name: string;
    breed: {
      name: string;
    } | null;
    breeder: {
      name: string;
    } | null;
  } | null;
};

type RawParticipant = {
  conversation_id: string;
  last_read_at: string | null;
};

type RawMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: "customer" | "admin";
  created_at: string;
};

export async function getCustomerConversations(): Promise<
  ConversationListItem[]
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  /*
   * First load only conversations belonging to this customer.
   *
   * RLS independently enforces conversation access.
   */
  const {
    data: conversationData,
    error: conversationError,
  } = await supabase
    .from("conversations")
    .select(
      `
        id,
        status,
        last_message_at,
        last_message_preview,
        last_message_sender_role,
        created_at,
        puppy:puppies (
          id,
          name,
          breed:breeds (
            name
          ),
          breeder:breeders (
            name
          )
        )
      `
    )
    .eq("customer_id", user.id)
    .order("last_message_at", {
      ascending: false,
      nullsFirst: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (conversationError) {
    console.error(
      "Failed to load customer conversations:",
      conversationError
    );

    return [];
  }

  const conversations =
    (conversationData ?? []) as unknown as RawConversation[];

  if (conversations.length === 0) {
    return [];
  }

  const conversationIds =
    conversations.map(
      (conversation) => conversation.id
    );

  /*
   * Load the current customer's read state.
   *
   * There should be exactly one participant row per
   * conversation/customer pair.
   */
  const {
    data: participantData,
    error: participantError,
  } = await supabase
    .from("conversation_participants")
    .select(
      `
        conversation_id,
        last_read_at
      `
    )
    .eq("user_id", user.id)
    .in(
      "conversation_id",
      conversationIds
    );

  if (participantError) {
    console.error(
      "Failed to load conversation read state:",
      participantError
    );
  }

  const readStateByConversation =
    new Map<string, string | null>(
      (
        (participantData ?? []) as RawParticipant[]
      ).map((participant) => [
        participant.conversation_id,
        participant.last_read_at,
      ])
    );

  /*
   * Load admin messages so we can calculate unread counts.
   *
   * We intentionally do not trust client-side timestamps for this.
   */
  const {
    data: messageData,
    error: messageError,
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
    .eq("sender_role", "admin")
    .order("created_at", {
      ascending: true,
    });

  if (messageError) {
    console.error(
      "Failed to load unread message state:",
      messageError
    );
  }

  const adminMessagesByConversation =
    new Map<string, RawMessage[]>();

  for (const message of
    (messageData ?? []) as RawMessage[]) {
    const existing =
      adminMessagesByConversation.get(
        message.conversation_id
      ) ?? [];

    existing.push(message);

    adminMessagesByConversation.set(
      message.conversation_id,
      existing
    );
  }

  /*
   * Puppy cover images are loaded separately because the
   * inbox only needs one image per puppy.
   */
  const puppyIds = conversations
    .map(
      (conversation) =>
        conversation.puppy?.id
    )
    .filter(
      (id): id is string => Boolean(id)
    );

  const coverImageByPuppy =
    new Map<string, string | null>();

  if (puppyIds.length > 0) {
    const {
      data: mediaData,
      error: mediaError,
    } = await supabase
      .from("puppy_media")
      .select(
        `
          puppy_id,
          url,
          is_cover,
          sort_order
        `
      )
      .in(
        "puppy_id",
        puppyIds
      )
      .order("is_cover", {
        ascending: false,
      })
      .order("sort_order", {
        ascending: true,
      });

    if (mediaError) {
      console.error(
        "Failed to load puppy cover images:",
        mediaError
      );
    } else {
      for (const media of mediaData ?? []) {
        const puppyId =
          media.puppy_id as string;

        if (
          !coverImageByPuppy.has(puppyId)
        ) {
          coverImageByPuppy.set(
            puppyId,
            media.url as string
          );
        }
      }
    }
  }

  return conversations
    .filter(
      (
        conversation
      ): conversation is RawConversation & {
        puppy: NonNullable<
          RawConversation["puppy"]
        >;
      } => Boolean(conversation.puppy)
    )
    .map((conversation) => {
      const lastReadAt =
        readStateByConversation.get(
          conversation.id
        ) ?? null;

      const adminMessages =
        adminMessagesByConversation.get(
          conversation.id
        ) ?? [];

      const unreadMessages =
        adminMessages.filter((message) => {
          /*
           * If the customer has never read this conversation,
           * every admin message is unread.
           */
          if (!lastReadAt) {
            return true;
          }

          return (
            new Date(
              message.created_at
            ).getTime() >
            new Date(
              lastReadAt
            ).getTime()
          );
        });

      const puppy = conversation.puppy;

      return {
        id: conversation.id,
        status: conversation.status,

        puppy: {
          id: puppy.id,
          name: puppy.name,
          breed:
            puppy.breed?.name ??
            "Unknown breed",
          breederName:
            puppy.breeder?.name ?? null,
          imageUrl:
            coverImageByPuppy.get(
              puppy.id
            ) ?? null,
        },

        lastMessageAt:
          conversation.last_message_at,

        lastMessagePreview:
          conversation.last_message_preview,

        lastMessageSenderRole:
          conversation.last_message_sender_role,

        createdAt:
          conversation.created_at,

        hasUnread:
          unreadMessages.length > 0,

        unreadCount:
          unreadMessages.length,
      };
    });
}