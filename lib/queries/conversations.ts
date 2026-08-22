import { createClient } from "@/lib/supabase/server";

export type ConversationListItem = {
  id: string;
  status: "open" | "closed";
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  lastMessageSenderRole: "customer" | "admin" | null;
  createdAt: string;

  puppy: {
    id: string;
    name: string;
    breed: string;
    coverImage: string | null;
  };

  breeder: {
    name: string | null;
    slug: string | null;
    photoUrl: string | null;
  };
};

export type ConversationDetail = {
  id: string;
  status: "open" | "closed";
  customerId: string;
  createdAt: string;

  puppy: {
    id: string;
    name: string;
    breed: string;
    coverImage: string | null;
  };

  breeder: {
    name: string | null;
    slug: string | null;
    photoUrl: string | null;
  };
};

type RawMedia = {
  url: string;
  media_type: "image" | "video";
  is_cover: boolean;
  sort_order: number;
};

type RawBreeder = {
  name: string;
  slug: string;
  photo_url: string | null;
} | null;

type RawBreed = {
  name: string;
} | null;

type RawPuppy = {
  id: string;
  name: string;
  breeds: RawBreed;
  breeders: RawBreeder;
  puppy_media: RawMedia[] | null;
} | null;

function getCoverImage(
  media: RawMedia[] | null | undefined
): string | null {
  if (!media || media.length === 0) {
    return null;
  }

  const sortedMedia = [...media].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    sortedMedia.find((item) => item.is_cover)?.url ??
    sortedMedia[0]?.url ??
    null
  );
}

function mapPuppyContext(puppy: RawPuppy) {
  return {
    puppy: {
      id: puppy?.id ?? "",
      name: puppy?.name ?? "Unknown puppy",
      breed: puppy?.breeds?.name ?? "Unknown",
      coverImage: getCoverImage(
        puppy?.puppy_media
      ),
    },

    breeder: {
      name: puppy?.breeders?.name ?? null,
      slug: puppy?.breeders?.slug ?? null,
      photoUrl:
        puppy?.breeders?.photo_url ?? null,
    },
  };
}

/**
 * Load the authenticated customer's inbox.
 *
 * Security:
 * - Authentication is checked server-side.
 * - customer_id is explicitly restricted to auth user.
 * - RLS remains the database-level security boundary.
 */
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

  const { data, error } = await supabase
    .from("conversations")
    .select(
      `
        id,
        status,
        last_message_at,
        last_message_preview,
        last_message_sender_role,
        created_at,

        puppies (
          id,
          name,

          breeds (
            name
          ),

          breeders (
            name,
            slug,
            photo_url
          ),

          puppy_media (
            url,
            media_type,
            is_cover,
            sort_order
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

  if (error) {
    console.error(
      "Failed to load customer conversations:",
      error
    );

    return [];
  }

  return (data ?? []).map((conversation) => {
    const rawConversation =
      conversation as unknown as {
        id: string;
        status: "open" | "closed";
        last_message_at: string | null;
        last_message_preview: string | null;
        last_message_sender_role:
          | "customer"
          | "admin"
          | null;
        created_at: string;
        puppies: RawPuppy;
      };

    const context = mapPuppyContext(
      rawConversation.puppies
    );

    return {
      id: rawConversation.id,
      status: rawConversation.status,
      lastMessageAt:
        rawConversation.last_message_at,
      lastMessagePreview:
        rawConversation.last_message_preview,
      lastMessageSenderRole:
        rawConversation.last_message_sender_role,
      createdAt: rawConversation.created_at,

      ...context,
    };
  });
}

/**
 * Securely load one conversation belonging to the current customer.
 *
 * The conversation ID in the URL is never sufficient authorization.
 *
 * Returns null when:
 * - user is not authenticated
 * - conversation does not exist
 * - conversation belongs to another customer
 */
export async function getCustomerConversation(
  conversationId: string
): Promise<ConversationDetail | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("conversations")
    .select(
      `
        id,
        status,
        customer_id,
        created_at,

        puppies (
          id,
          name,

          breeds (
            name
          ),

          breeders (
            name,
            slug,
            photo_url
          ),

          puppy_media (
            url,
            media_type,
            is_cover,
            sort_order
          )
        )
      `
    )
    .eq("id", conversationId)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load customer conversation:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  const rawConversation =
    data as unknown as {
      id: string;
      status: "open" | "closed";
      customer_id: string;
      created_at: string;
      puppies: RawPuppy;
    };

  const context = mapPuppyContext(
    rawConversation.puppies
  );

  return {
    id: rawConversation.id,
    status: rawConversation.status,
    customerId: rawConversation.customer_id,
    createdAt: rawConversation.created_at,

    ...context,
  };
}