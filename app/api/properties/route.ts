import { NextRequest, NextResponse } from "next/server";

import { getLoopsClient, toErrorResponse } from "@/app/api/_lib/loops";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const list = searchParams.get("list") === "custom" ? "custom" : "all";

  try {
    const loops = getLoopsClient();
    const data = await loops.listContactProperties(list);
    return NextResponse.json({ data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = body?.name;
  const type = body?.type;
  const allowedTypes = new Set(["string", "number", "boolean", "date"]);

  if (!name || !type) {
    return NextResponse.json(
      { error: true, message: "Provide both `name` and `type`." },
      { status: 400 }
    );
  }

  if (!allowedTypes.has(type)) {
    return NextResponse.json(
      { error: true, message: "type must be one of: string, number, boolean, date." },
      { status: 400 }
    );
  }

  try {
    const loops = getLoopsClient();
    const data = await loops.createContactProperty(
      name,
      type as "string" | "number" | "boolean" | "date"
    );
    return NextResponse.json({ data });
  } catch (error) {
    return toErrorResponse(error);
  }
}
