import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { ROLES } from "@/lib/permissions";

export const SESSION_COOKIE = "ar_design_studio_session";

export function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "local-ar-design-studio-secret-change-me";
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function signSession(user) {
  return jwt.sign(
    {
      userId: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      businessId: user.businessId ? String(user.businessId) : null,
      permissions: user.permissions || {}
    },
    getAuthSecret(),
    { expiresIn: "7d" }
  );
}

export function verifySessionToken(token) {
  try {
    return jwt.verify(token, getAuthSecret());
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = token ? verifySessionToken(token) : null;
  if (!session?.userId) return null;

  await connectDB();
  const user = await User.findById(session.userId).lean();
  if (!user || !user.isActive) return null;
  return {
    ...user,
    _id: String(user._id),
    businessId: user.businessId ? String(user.businessId) : null
  };
}

export function setSessionCookie(response, token) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}

export function clearSessionCookie() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return response;
}

export function allowedSuperAdminEmails() {
  const emails = [
    process.env.SUPER_ADMIN_EMAIL,
    ...(process.env.SUPER_ADMIN_ALLOWED_EMAILS || "").split(",")
  ];
  return emails.map((email) => email?.trim().toLowerCase()).filter(Boolean);
}

export async function ensureEnvSuperAdmin(email) {
  await connectDB();
  const normalized = email.toLowerCase().trim();
  const allowed = allowedSuperAdminEmails();
  if (!allowed.includes(normalized)) {
    throw new Error("This email is not allowed for Super Admin access.");
  }

  let user = await User.findOne({ email: normalized });
  if (!user) {
    if (!process.env.SUPER_ADMIN_PASSWORD) throw new Error("SUPER_ADMIN_PASSWORD is not configured.");
    user = await User.create({
      name: process.env.SUPER_ADMIN_NAME || "AR Design Studio Admin",
      email: normalized,
      passwordHash: await hashPassword(process.env.SUPER_ADMIN_PASSWORD),
      role: ROLES.SUPER_ADMIN,
      isActive: true
    });
  }

  if (user.role !== ROLES.SUPER_ADMIN) {
    throw new Error("This email already exists with a different role.");
  }

  return user;
}
