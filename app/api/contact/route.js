import { NextResponse } from "next/server";
import { processContactRequest } from "@/lib/contactRequest";
import { LIMITS, clientIp, rateLimit, tooMany } from "@/lib/rateLimit";
import { jsonPublicError, makeErrorRef } from "@/lib/requestContext";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const limited = rateLimit(`contact:${clientIp(request)}`, LIMITS.contact);
  if (!limited.ok) {
    const fail = tooMany(limited.retryAfterSec);
    return NextResponse.json(fail.body, { status: fail.status, headers: fail.headers });
  }
  try {
    const result = await processContactRequest(request);
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    return jsonPublicError("Request could not be sent.", 500, makeErrorRef());
  }
}
