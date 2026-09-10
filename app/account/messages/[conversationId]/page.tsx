import { notFound, redirect } from "next/navigation";

import ConversationThread from "../../../components/messages/ConversationThread";

import { createClient } from "@/lib/supabase/server";
import {
  getCustomerMessages,
  type Message,
  type MessageCursor,
} from "@/lib/queries/messages";

type ConversationRow = {
  id: string;
  puppy_id: string;
  customer_id: string;
  status: "open" | "closed";
  last_message_at: string | null;
  created_at: string;
};

type PuppyRow = {
  id: string;
  name: string;
  puppy_media:
    | {
        url: string;
        is_cover: boolean;
        sort_order: number;
      }[]
    | null;
  breed:
    | { name: string }
    | { name: string }[]
    | null;
  breeder:
    | { name: string; photo_url: string | null }
    | { name: string; photo_url: string | null }[]
    | null;
};

function getSingleRelation<T>(
  relation: T | T[] | null
): T | null {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{
    conversationId: string;
  }>;
}) {
  const { conversationId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/account/messages/${conversationId}`);
  }

  const {
    data: conversation,
    error: conversationError,
  } = await supabase
    .from("conversations")
    .select(`
      id,
      puppy_id,
      customer_id,
      status,
      last_message_at,
      created_at
    `)
    .eq("id", conversationId)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (conversationError) {
    console.error(
      "Failed to load conversation:",
      conversationError
    );
  }

  if (!conversation) {
    notFound();
  }

  const typedConversation = conversation as ConversationRow;

  const {
    data: puppy,
    error: puppyError,
  } = await supabase
    .from("puppies")
    .select(`
      id,
      name,
      puppy_media (
        url,
        is_cover,
        sort_order
      ),
      breed:breeds (
        name
      ),
      breeder:breeders (
        name,
        photo_url
      )
    `)
    .eq("id", typedConversation.puppy_id)
    .maybeSingle();

  if (puppyError) {
    console.error(
      "Failed to load conversation puppy:",
      puppyError
    );
  }

  if (!puppy) {
    notFound();
  }

  const typedPuppy = puppy as PuppyRow;

  const coverImage =
    typedPuppy.puppy_media
      ?.slice()
      .sort(
        (a, b) =>
          a.sort_order - b.sort_order
      )
      .find(
        (media) => media.is_cover
      )?.url ??
    typedPuppy.puppy_media
      ?.slice()
      .sort(
        (a, b) =>
          a.sort_order - b.sort_order
      )[0]?.url ??
    null;

  const page = await getCustomerMessages(
    conversationId,
    {
      limit: 30,
    }
  );

  if (!page) {
    notFound();
  }

  const initialMessages: Message[] =
    page.messages;

  const nextCursor: MessageCursor | null =
    page.nextCursor;

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#eef1ea] md:flex md:items-center md:justify-center md:p-6">
      <div className="flex h-full w-full flex-col overflow-hidden bg-[#faf9f5] md:h-[calc(100dvh-3rem)] md:max-w-4xl md:rounded-[28px] md:border md:border-sage/10 md:shadow-[0_30px_80px_rgba(23,63,58,0.12)]">
        <ConversationThread
          conversationId={typedConversation.id}
          puppy={{
            id: typedPuppy.id,
            name: typedPuppy.name,
            image: coverImage,
            breed: getSingleRelation(typedPuppy.breed)?.name ?? null,
            breederName: getSingleRelation(typedPuppy.breeder)?.name ?? null,
            breederPhotoUrl: getSingleRelation(typedPuppy.breeder)?.photo_url ?? null,
          }}
          initialMessages={initialMessages}
          initialNextCursor={nextCursor}
          initialHasMore={page.hasMore}
        />
      </div>
    </main>
  );
}