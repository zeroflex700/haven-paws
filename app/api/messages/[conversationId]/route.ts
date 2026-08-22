import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  getCustomerMessages,
  type MessageCursor,
} from "@/lib/queries/messages";

const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 50;

type RouteContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

function parseLimit(value: string | null): number {
  if (!value) {
    return DEFAULT_LIMIT;
  }

  const parsed = Number.parseInt(value, 10);

  if (
    !Number.isFinite(parsed) ||
    parsed < 1
  ) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
}

function parseCursor(
  createdAt: string | null,
  id: string | null
): MessageCursor | null {
  /*
   * No cursor means this is the first page.
   */
  if (!createdAt && !id) {
    return null;
  }

  /*
   * A valid keyset cursor requires both values.
   */
  if (!createdAt || !id) {
    return null;
  }

  const timestamp = new Date(createdAt);

  if (Number.isNaN(timestamp.getTime())) {
    return null;
  }

  return {
    createdAt: timestamp.toISOString(),
    id,
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { conversationId } = await params;

    if (!conversationId) {
      return NextResponse.json(
        {
          error: "Conversation ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const limit = parseLimit(
      searchParams.get("limit")
    );

    const cursor = parseCursor(
      searchParams.get("createdAt"),
      searchParams.get("id")
    );

    /*
     * Check authentication before loading anything.
     *
     * getCustomerMessages() independently checks again
     * and verifies conversation ownership.
     */
    const supabase =
      await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * The query function gets the authenticated user
     * from the server and verifies:
     *
     * conversations.id === conversationId
     * AND
     * conversations.customer_id === auth.uid()
     *
     * So a customer cannot use this API route to read
     * another customer's conversation.
     */
    const page =
      await getCustomerMessages(
        conversationId,
        {
          cursor,
          limit,
        }
      );

    if (!page) {
      /*
       * Do not reveal whether the conversation exists.
       *
       * From a customer's perspective, an inaccessible
       * conversation and a nonexistent conversation should
       * look the same.
       */
      return NextResponse.json(
        {
          error: "Conversation not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error(
      "Failed to load conversation messages:",
      error
    );

    return NextResponse.json(
      {
        error: "Could not load messages",
      },
      {
        status: 500,
      }
    );
  }
}