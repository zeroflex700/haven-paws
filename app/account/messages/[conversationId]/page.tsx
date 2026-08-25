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
    | {
        name: string;
      }[]
    | null;
  breeder:
    | {
        name: string;
      }[]
    | null;
};

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
    redirect(
      `/login?redirect=/account/messages/${conversationId}`
    );
  }

  /*
   * Security boundary:
   *
   * Do not trust the conversation ID from the URL.
   *
   * Explicitly verify that this conversation belongs to the
   * authenticated customer.
   *
   * RLS provides an additional database-level protection layer.
   */
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

  const typedConversation =
    conversation as ConversationRow;

  /*
   * Load compact puppy context separately.
   *
   * The conversation thread only needs enough information to
   * remind the customer which puppy they are discussing.
   */
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
        name
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

  /*
   * Initial message history.
   *
   * getCustomerMessages independently verifies ownership and
   * then relies on RLS for another layer of protection.
   */
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
    <main className="min-h-screen bg-cream">
      <Navbar />

      <section className="border-b border-sage/10 bg-cream">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-4">
          <p className="eyebrow">
            Your Account
          </p>

          <h1 className="font-display text-2xl sm:text-3xl text-forest mt-1">
            Messages
          </h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-8">
        <ConversationThread
          conversationId={
            typedConversation.id
          }
          puppy={{
            id: typedPuppy.id,
            name: typedPuppy.name,
            image: coverImage,
            breed: typedPuppy.breed?.[0]?.name ?? null,
            breederName: typedPuppy.breeder?.[0]?.name ?? null,
          }}
          initialMessages={
            initialMessages
          }
          initialNextCursor={
            nextCursor
          }
          initialHasMore={
            page.hasMore
          }
        />
      </section>

      <Footer />
    </main>
  );
}