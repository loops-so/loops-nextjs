import { NextRequest, NextResponse } from "next/server";

import { getLoopsClient, toErrorResponse } from "@/app/api/_lib/loops";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const perPageParam = searchParams.get("perPage");
  const perPage = perPageParam ? Number(perPageParam) : 20;
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const loops = getLoopsClient();
    const data = await loops.listTransactionalEmails({ perPage, cursor });
    return NextResponse.json({ data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = body?.email;
  const transactionalId = body?.transactionalId;
  const addToAudience = body?.addToAudience ?? true;
  const dataVariables = body?.dataVariables ?? { demoValue: "from-nextjs" };

  if (!email || !transactionalId) {
    return NextResponse.json(
      { error: true, message: "Provide both `email` and `transactionalId`." },
      { status: 400 }
    );
  }

  try {
    const loops = getLoopsClient();
    const data = await loops.sendTransactionalEmail({
      email,
      transactionalId,
      addToAudience,
      dataVariables,
    });
    return NextResponse.json({ data });
  } catch (error) {
    return toErrorResponse(error);
  }
}
