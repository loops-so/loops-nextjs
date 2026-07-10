import { NextRequest, NextResponse } from "next/server";

import { RateLimitExceededError } from "loops";

import { getLoopsClient, toErrorResponse } from "@/app/api/_lib/loops";

export async function POST(request: NextRequest) {
  const loops = getLoopsClient();
  const body = await request.json();
  const email = body?.email;
  const userId = body?.userId;
  const properties = body?.properties ?? {};
  const mailingLists = body?.mailingLists;

  const queryParams = new URL(request.url).searchParams;
  if (queryParams.has("ratelimit")) {
    const promises: Promise<unknown>[] = [];
    const numRequests = 15;
    const batchProperties = { testValue: Date.now() };

    for (let i = 0; i < numRequests; i++) {
      promises.push(
        loops.updateContact({
          email,
          userId,
          properties: { ...batchProperties, iteration: i },
        })
      );
    }

    const results = { success: 0, rateLimited: 0, errors: 0 };
    const settled = await Promise.allSettled(promises);
    for (const result of settled) {
      if (result.status === "fulfilled") {
        results.success++;
      } else if (result.reason instanceof RateLimitExceededError) {
        results.rateLimited++;
      } else {
        results.errors++;
      }
    }

    return NextResponse.json(results);
  }

  try {
    const data = await loops.updateContact({
      email,
      userId,
      properties,
      mailingLists,
    });
    return NextResponse.json({ data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  const loops = getLoopsClient();
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("q") ?? searchParams.get("email");
  const userId = searchParams.get("userId");

  if (!email && !userId) {
    return NextResponse.json(
      { error: true, message: "Provide either `email` (or `q`) or `userId`." },
      { status: 400 }
    );
  }

  if (email && userId) {
    return NextResponse.json(
      { error: true, message: "Provide only one of `email`/`q` or `userId`." },
      { status: 400 }
    );
  }

  try {
    const data = await loops.findContact({
      email: email ?? undefined,
      userId: userId ?? undefined,
    });
    return NextResponse.json({ data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  const loops = getLoopsClient();
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");

  try {
    const data = await loops.deleteContact({
      email: email ?? undefined,
      userId: userId ?? undefined,
    });
    return NextResponse.json({ data });
  } catch (error) {
    return toErrorResponse(error);
  }
}