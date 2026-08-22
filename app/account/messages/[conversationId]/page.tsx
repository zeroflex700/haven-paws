import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ConversationThread from "../../../components/messaging/ConversationThread";

import { createClient } from "@/lib/supabase/server";
import { getPuppyDetail } from "@/lib/queries/puppyDetail";

import type {
  Conversation,
  Message,
  PuppyConversationContext,
} from "@/lib/types/messaging";

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
    data: {
      user,
    },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectTo =
      `/account/messages/${conversationId}`;

    redirect(
      `/account/login?redirectTo=${encodeURIComponent(
        redirectTo
      )}`
    );
  }

  /*
   * SECURITY:
   *
   * This query runs using the authenticated user's Supabase
   * session. The database RLS policy is the real authorization
   * boundary.
   *
   * If a customer manually changes the conversation ID in the URL,
   * they cannot read another customer's conversation.
   */
  const {
    data: conversationData,
    error: conversationError,
  } = await supabase
    .from("conversations")
    .select(`
      id,
      puppy_id,
      customer_id,
      status,
      last_message_at,
      last_message_preview,
      last_message_sender_role,
      created_at,
      updated_at
    `)
    .eq("id", conversationId)
    .maybeSingle();

  if (conversationError) {
    console.error(
      "Failed to load conversation:",
      conversationError
    );
  }

  /*
   * Do not reveal whether another customer's conversation exists.
   *
   * From the customer's perspective, inaccessible conversations
   * simply behave as "not found".
   */
  if (!conversationData) {
    notFound();
  }

  const conversation =
    conversationData as Conversation;

  /*
   * RLS separately protects the messages table.
   */
  const {
    data: messagesData,
    error: messagesError,
  } = await supabase
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
    .eq("conversation_id", conversation.id)
    .order("created_at", {
      ascending: true,
    })
    .order("id", {
      ascending: true,
    });

  if (messagesError) {
    console.error(
      "Failed to load messages:",
      messagesError
    );
  }

  const messages =
    (messagesData ?? []) as Message[];

  /*
   * Reuse the existing puppy detail query rather than guessing
   * about your puppies/breeders/media schema here.
   */
  const puppy = await getPuppyDetail(
    conversation.puppy_id
  );

  if (!puppy) {
    notFound();
  }

  const coverImage =
    puppy.media.find(
      (item) => item.isCover
    )?.url ??
    puppy.media[0]?.url ??
    null;

  const puppyContext: PuppyConversationContext = {
    id: puppy.id,
    name: puppy.name,
    breed: puppy.breed,
    coverImage,
    breederName:
      puppy.breederName ?? null,
    breederPhotoUrl:
      puppy.breederPhotoUrl ?? null,
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <section className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

          {/* Compact navigation */}
          <div className="mb-4">
            <Link
              href="/account/messages"
              className="inline-flex items-center gap-2 text-sm text-forest/70 hover:text-forest transition-colors"
            >
              <ArrowLeft
                size={16}
                strokeWidth={1.8}
              />

              Back to messages
            </Link>
          </div>

          {/* Compact thread container */}
          <div className="border border-sage/15 bg-white rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(39,63,48,0.06)]">

            <div className="border-b border-sage/10 px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-xl bg-cream-alt border border-sage/10 flex items-center justify-center shrink-0 text-forest">
                  <MessageCircle
                    size={18}
                    strokeWidth={1.7}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-forest">
                    Conversation with{" "}
                    {puppyContext.breederName ??
                      "the breeder"}
                  </p>

                  <p className="text-xs text-ink/55 mt-0.5">
                    Ask questions and get to know{" "}
                    {puppyContext.name}.
                  </p>
                </div>
              </div>
            </div>

            <ConversationThread
              conversationId={conversation.id}
              currentUserId={user.id}
              initialMessages={messages}
              puppy={puppyContext}
              conversationStatus={
                conversation.status
              }
            />

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}