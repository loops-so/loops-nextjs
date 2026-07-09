import { NextRequest, NextResponse } from "next/server";

import { getLoopsClient, toErrorResponse } from "@/app/api/_lib/loops";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body?.email;
  const userId = body?.userId;
  const eventName = body?.eventName ?? "demoEvent";
  const eventProperties = body?.eventProperties ?? { source: "nextjs-demo" };
  const contactProperties = body?.contactProperties;
  const mailingLists = body?.mailingLists;

  if (!email && !userId) {
    return NextResponse.json(
      { error: true, message: "Provide either `email` or `userId`." },
      { status: 400 }
    );
  }

  try {
    const loops = getLoopsClient();
    const data = await loops.sendEvent({
      email,
      userId,
      eventName,
      eventProperties,
      contactProperties,
      mailingLists,
    });
    return NextResponse.json({ data });
  } catch (error) {
    return toErrorResponse(error);
  }
}
