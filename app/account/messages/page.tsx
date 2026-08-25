import Link from "next/link";
import Image from "next/image";
import AccountInboxRealtime from "./AccountInboxRealtime";
import {
  MessageCircle,
  ChevronRight,
  MessagesSquare,
  Sparkles,
  PawPrint,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import { getCustomerConversations } from "@/lib/queries/conversations";

function formatConversationTime(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays < 7) {
    return new Intl.DateTimeFormat("en", {
      weekday: "short",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export default async function MessagesPage() {
  const conversations = await getCustomerConversations();

  return (
    <main className="min-h-screen bg-[#f7f5ef]">
      <AccountInboxRealtime />

      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-sage/10 bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-forest/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-forest text-cream shadow-sm">
                  <MessagesSquare size={15} />
                </span>

                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage">
                  Your Account
                </span>
              </div>

              <h1 className="font-display text-4xl tracking-tight text-forest sm:text-5xl">
                Your messages
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-ink/60 sm:text-base">
                Keep every conversation about your future companion
                beautifully organised in one place.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-sage/10 bg-[#faf9f5] px-4 py-3 shadow-[0_8px_30px_rgba(39,63,48,0.04)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-forest shadow-sm">
                <PawPrint size={18} strokeWidth={1.7} />
              </div>

              <div>
                <p className="text-lg font-semibold leading-none text-forest">
                  {conversations.length}
                </p>
                <p className="mt-1 text-[11px] font-medium text-ink/45">
                  {conversations.length === 1
                    ? "conversation"
                    : "conversations"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INBOX */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8">
          {conversations.length === 0 ? (
            <EmptyMessagesState />
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-forest">
                    Conversations
                  </h2>
                  <p className="mt-1 text-xs text-ink/45">
                    Select a conversation to continue where you left off.
                  </p>
                </div>

                <div className="hidden items-center gap-1.5 text-xs text-gold sm:flex">
                  <Sparkles size={13} />
                  <span>Stay connected</span>
                </div>
              </div>

              <div className="overflow-hidden rounded-[30px] border border-sage/10 bg-white shadow-[0_18px_60px_rgba(39,63,48,0.06)]">
                <div className="divide-y divide-sage/10">
                  {conversations.map((conversation) => {
                    const preview = conversation.lastMessagePreview
                      ? `${
                          conversation.lastMessageSenderRole === "customer"
                            ? "You: "
                            : ""
                        }${conversation.lastMessagePreview}`
                      : "Start the conversation with the Haven Paws team.";

                    return (
                      <Link
                        key={conversation.id}
                        href={`/account/messages/${conversation.id}`}
                        className="group relative block overflow-hidden transition hover:bg-[#fcfbf7]"
                      >
                        <div className="absolute inset-y-0 left-0 w-1 origin-center scale-y-0 bg-gold transition-transform duration-300 group-hover:scale-y-100" />

                        <div className="flex items-center gap-4 p-4 sm:gap-5 sm:p-5 lg:p-6">
                          {/* AVATAR */}
                          <div className="relative h-16 w-16 shrink-0 sm:h-[76px] sm:w-[76px]">
                            <div className="absolute inset-0 rounded-[22px] bg-cream-alt" />

                            <div className="relative h-full w-full overflow-hidden rounded-[22px] border border-sage/10 bg-cream-alt">
                              {conversation.puppy.breederPhotoUrl ? (
                                <Image
                                  src={conversation.puppy.breederPhotoUrl}
                                  alt={
                                    conversation.puppy.breederName ??
                                    "Breeder"
                                  }
                                  fill
                                  className="object-cover transition duration-500 group-hover:scale-105"
                                  sizes="76px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-forest/30">
                                  <MessageCircle
                                    size={24}
                                    strokeWidth={1.5}
                                  />
                                </div>
                              )}
                            </div>

                            {conversation.hasUnread && (
                              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-[3px] border-white bg-gold shadow-sm" />
                            )}
                          </div>

                          {/* CONTENT */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p
                                    className={`truncate text-sm sm:text-base ${
                                      conversation.hasUnread
                                        ? "font-bold text-forest"
                                        : "font-semibold text-forest"
                                    }`}
                                  >
                                    {conversation.puppy.breederName ??
                                      "Breeder"}
                                  </p>

                                  {conversation.hasUnread && (
                                    <span className="hidden rounded-full bg-gold/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold sm:inline-flex">
                                      New
                                    </span>
                                  )}
                                </div>

                                <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                  <span className="text-xs font-medium text-sage">
                                    {conversation.puppy.name}
                                  </span>

                                  <span className="h-1 w-1 rounded-full bg-sage/30" />

                                  <span className="truncate text-xs text-ink/40">
                                    {conversation.puppy.breed}
                                  </span>
                                </div>
                              </div>

                              <div className="flex shrink-0 items-center gap-3">
                                {conversation.lastMessageAt && (
                                  <span
                                    className={`text-[11px] ${
                                      conversation.hasUnread
                                        ? "font-semibold text-forest"
                                        : "text-ink/40"
                                    }`}
                                  >
                                    {formatConversationTime(
                                      conversation.lastMessageAt
                                    )}
                                  </span>
                                )}

                                <ChevronRight
                                  size={18}
                                  strokeWidth={1.5}
                                  className="text-sage/40 transition-all duration-200 group-hover:translate-x-1 group-hover:text-forest"
                                />
                              </div>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                              <p
                                className={`min-w-0 flex-1 truncate text-xs sm:text-sm ${
                                  conversation.hasUnread
                                    ? "font-medium text-ink/70"
                                    : "text-ink/50"
                                }`}
                              >
                                {preview}
                              </p>

                              {conversation.unreadCount > 0 && (
                                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-forest px-1.5 text-[10px] font-semibold text-cream shadow-sm">
                                  {conversation.unreadCount > 99
                                    ? "99+"
                                    : conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function EmptyMessagesState() {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[32px] border border-sage/10 bg-white px-6 py-14 text-center shadow-[0_18px_60px_rgba(39,63,48,0.05)] sm:px-10 sm:py-20">
      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-gold/5 blur-3xl" />

      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-sage/10 bg-[#faf9f5] text-forest shadow-sm">
          <MessageCircle size={27} strokeWidth={1.5} />
        </div>

        <h2 className="mt-6 font-display text-3xl text-forest">
          No messages yet
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink/55 sm:text-base">
          When you contact us about a puppy, your conversation
          will appear here and you can continue it anytime.
        </p>

        <Link
          href="/puppies"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-cream shadow-lg shadow-forest/10 transition hover:-translate-y-0.5 hover:bg-forest-light"
        >
          Meet Our Puppies
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
}