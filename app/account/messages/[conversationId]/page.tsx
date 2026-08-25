import { notFound, redirect } from "next/navigation";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

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
    <main className="min-h-screen bg-[#f7f5ef]">
      <Navbar />

      {/* PAGE INTRO */}
      <section className="border-b border-sage/10 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sage">
              Your Account
            </span>

            <span className="h-1 w-1 rounded-full bg-sage/40" />

            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink/35">
              Messages
            </span>
          </div>

          <h1 className="mt-2 font-display text-2xl tracking-tight text-forest sm:text-3xl">
            Conversation
          </h1>
        </div>
      </section>

      {/* CHAT */}
      <section className="mx-auto max-w-6xl px-0 py-0 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="overflow-hidden bg-white sm:rounded-[32px] sm:border sm:border-sage/10 sm:shadow-[0_20px_70px_rgba(39,63,48,0.07)]">
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
      </section>

      <Footer />
    </main>
  );
}