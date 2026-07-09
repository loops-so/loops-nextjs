import { NextResponse } from "next/server";

import { getLoopsClient, toErrorResponse } from "@/app/api/_lib/loops";

export async function GET() {
  try {
    const loops = getLoopsClient();
    const data = await loops.listMailingLists();
    return NextResponse.json({ data });
  } catch (error) {
    return toErrorResponse(error);
  }
}
