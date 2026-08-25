import Link from "next/link";
import Image from "next/image";
import AccountInboxRealtime from "./AccountInboxRealtime";
import { MessageCircle, ChevronRight } from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  getCustomerConversations,
} from "@/lib/queries/conversations";

function formatConversationTime(
  value: string | null
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const now = new Date();

  const sameDay =
    date.toDateString() ===
    now.toDateString();

  if (sameDay) {
    return new Intl.DateTimeFormat(
      "en",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    ).format(date);
  }

  const diffDays = Math.floor(
    (
      now.getTime() -
      date.getTime()
    ) /
      (1000 * 60 * 60 * 24)
  );

  if (diffDays < 7) {
    return new Intl.DateTimeFormat(
      "en",
      {
        weekday: "short",
      }
    ).format(date);
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      month: "short",
      day: "numeric",
    }
  ).format(date);
}

export default async function MessagesPage() {
  const conversations =
    await getCustomerConversations();

  return (
    <main className="min-h-screen bg-cream">
      <AccountInboxRealtime />

      <Navbar />
      

      <section className="border-b border-sage/10 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-10 py-10 sm:py-14">

          <p className="eyebrow mb-3">
            Your Account
          </p>

          <div className="flex items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-forest tracking-tight">
                Messages
              </h1>

              <p className="text-sm sm:text-base text-ink/60 mt-3 max-w-xl">
                Keep in touch with the Haven Paws
                team about the puppies you love.
              </p>
            </div>

            {conversations.length > 0 && (
              <div className="hidden sm:block text-right">
                <p className="text-xs text-sage">
                  {conversations.length === 1
                    ? "1 conversation"
                    : `${conversations.length} conversations`}
                </p>
              </div>
            )}
          </div>

        </div>
      </section>

      <section>
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-12">

          {conversations.length === 0 ? (
            <EmptyMessagesState />
          ) : (
            <div className="space-y-3">
              {conversations.map(
                (conversation) => (
                  <Link
                    key={conversation.id}
                    href={`/account/messages/${conversation.id}`}
                    className="group block rounded-[24px] border border-sage/10 bg-white hover:border-sage/25 hover:shadow-[0_12px_40px_rgba(39,63,48,0.07)] transition-all"
                  >
                    <div className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5">

                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl bg-cream-alt border border-sage/10">

                        {conversation.puppy.imageUrl ? (
                          <Image
                            src={
                              conversation.puppy
                                .imageUrl
                            }
                            alt={
                              conversation.puppy
                                .name
                            }
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-forest/30">
                            <MessageCircle
                              size={22}
                              strokeWidth={1.5}
                            />
                          </div>
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-4">

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">

                              {conversation.hasUnread && (
                                <span
                                  className="h-2 w-2 rounded-full bg-gold shrink-0"
                                  aria-label="Unread messages"
                                />
                              )}

                              <p
                                className={`text-sm sm:text-base truncate ${
                                  conversation.hasUnread
                                    ? "font-semibold text-forest"
                                    : "font-medium text-forest"
                                }`}
                              >
                                {conversation.puppy.name}
                              </p>

                            </div>

                            <p className="text-xs sm:text-sm text-sage mt-1 truncate">
                              {
                                conversation.puppy
                                  .breed
                              }
                            </p>

                            {conversation.puppy.breederName && (
                              <p className="text-[11px] sm:text-xs text-ink/40 mt-0.5 truncate">
                                Breeder: {conversation.puppy.breederName}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 flex items-center gap-2">

                            {conversation.lastMessageAt && (
                              <span
                                className={`text-[11px] sm:text-xs ${
                                  conversation.hasUnread
                                    ? "text-forest font-medium"
                                    : "text-ink/45"
                                }`}
                              >
                                {formatConversationTime(
                                  conversation.lastMessageAt
                                )}
                              </span>
                            )}

                            <ChevronRight
                              size={17}
                              strokeWidth={1.5}
                              className="text-sage/50 group-hover:text-forest transition-colors"
                            />

                          </div>

                        </div>

                        <div className="flex items-center gap-2 mt-2 sm:mt-3">

                          <p
                            className={`text-xs sm:text-sm truncate ${
                              conversation.hasUnread
                                ? "text-ink/75 font-medium"
                                : "text-ink/55"
                            }`}
                          >
                            {conversation.lastMessagePreview
                              ? `${
                                  conversation.lastMessageSenderRole ===
                                  "customer"
                                    ? "You: "
                                    : ""
                                }${
                                  conversation.lastMessagePreview
                                }`
                              : "Start the conversation with the Haven Paws team."}
                          </p>

                          {conversation.unreadCount > 0 && (
                            <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-forest text-cream text-[10px] font-medium flex items-center justify-center">
                              {conversation.unreadCount > 99
                                ? "99+"
                                : conversation.unreadCount}
                            </span>
                          )}

                        </div>

                      </div>

                    </div>
                  </Link>
                )
              )}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}

function EmptyMessagesState() {
  return (
    <div className="max-w-2xl mx-auto text-center rounded-[28px] border border-sage/10 bg-white px-6 py-14 sm:px-10 sm:py-20">

      <div className="h-14 w-14 mx-auto rounded-2xl bg-cream-alt border border-sage/10 flex items-center justify-center text-forest">
        <MessageCircle
          size={24}
          strokeWidth={1.5}
        />
      </div>

      <h2 className="font-display text-2xl sm:text-3xl text-forest mt-6">
        No messages yet
      </h2>

      <p className="text-sm sm:text-base text-ink/60 leading-7 mt-3 max-w-md mx-auto">
        When you message us about a puppy,
        your conversation will appear here.
      </p>

      <Link
        href="/puppies"
        className="inline-flex items-center justify-center mt-7 bg-forest text-cream px-6 py-3 rounded-full text-sm hover:bg-forest-light transition-colors"
      >
        Meet Our Puppies
      </Link>

    </div>
  );
}