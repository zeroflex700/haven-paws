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

  if (!Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
}

function parseCursor(
  createdAt: string | null,
  id: string | null
): MessageCursor | null {
  if (!createdAt && !id) {
    return null;
  }

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
     * Verify authentication on the server.
     *
     * Never trust a user ID supplied by the browser.
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
     * getCustomerMessages() must enforce conversation ownership
     * using the authenticated user's ID.
     *
     * The browser never gets unrestricted access to another
     * conversation through this route.
     */
    const page =
      await getCustomerMessages({
        conversationId,
        customerId: user.id,
        cursor,
        limit,
      });

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