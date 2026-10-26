import { handleLoginRequest } from "@/lib/authHandlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  return handleLoginRequest(request);
}
