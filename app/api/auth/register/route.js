import { handleRegisterRequest } from "@/lib/authHandlers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  return handleRegisterRequest(request);
}
