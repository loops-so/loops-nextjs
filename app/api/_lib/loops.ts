import { NextResponse } from "next/server";
import {
  APIError,
  LoopsClient,
  RateLimitExceededError,
  ValidationError,
} from "loops";

export function getLoopsClient() {
  const apiKey = process.env.LOOPS_API_KEY;
  if (!apiKey) throw new Error("LOOPS_API_KEY is not configured");
  return new LoopsClient(apiKey);
}

export function toErrorResponse(error: unknown) {
  if (error instanceof RateLimitExceededError) {
    return NextResponse.json(
      {
        error: true,
        message: "Rate limit exceeded. Please try again in a moment.",
        limit: error.limit,
        remaining: error.remaining,
      },
      { status: 429 }
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 400 }
    );
  }

  if (error instanceof APIError) {
    return NextResponse.json(
      { error: true, message: error.message, statusCode: error.statusCode },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: true, message: "Unexpected server error" },
    { status: 500 }
  );
}
