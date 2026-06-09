import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ROLES, canAccessBusiness } from "@/lib/permissions";

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export async function requireUser(roles = []) {
  const user = await getCurrentUser();
  if (!user) return { error: json({ error: "Authentication required." }, 401) };
  if (roles.length && !roles.includes(user.role)) return { error: json({ error: "Unauthorized." }, 403) };
  return { user };
}

export function requireBusinessAccess(user, businessId) {
  if (!canAccessBusiness(user, businessId)) return json({ error: "Business access denied." }, 403);
  return null;
}

export function isAdmin(user) {
  return user?.role === ROLES.SUPER_ADMIN;
}
