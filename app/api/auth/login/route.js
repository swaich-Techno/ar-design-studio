import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ensureEnvSuperAdmin, setSessionCookie, signSession, verifyPassword } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";
import { ROLES, TEAM_LOGIN_ROLES, BUSINESS_LOGIN_ROLES, STAFF_LOGIN_ROLES } from "@/lib/permissions";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { email, password, role, allowedRoles } = await request.json();
    const normalized = String(email || "").toLowerCase().trim();
    if (!normalized || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required." }, { status: 400 });
    }

    await connectDB();
    let user;

    if (role === ROLES.SUPER_ADMIN) {
      user = await ensureEnvSuperAdmin(normalized);
    } else if (role === "TEAM") {
      const roles = Array.isArray(allowedRoles) && allowedRoles.length ? allowedRoles : TEAM_LOGIN_ROLES;
      user = await User.findOne({ email: normalized, role: { $in: roles } });
    } else if (role === ROLES.BUSINESS_OWNER) {
      const roles = Array.isArray(allowedRoles) && allowedRoles.length ? allowedRoles : BUSINESS_LOGIN_ROLES;
      user = await User.findOne({ email: normalized, role: { $in: roles } });
    } else if (role === ROLES.STAFF) {
      const roles = Array.isArray(allowedRoles) && allowedRoles.length ? allowedRoles : STAFF_LOGIN_ROLES;
      user = await User.findOne({ email: normalized, role: { $in: roles } });
    } else {
      user = await User.findOne({ email: normalized, role });
    }

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (role !== "TEAM" && role !== ROLES.BUSINESS_OWNER && role !== ROLES.STAFF && user.role !== role) {
      return NextResponse.json({ error: "Use the correct login page for this account." }, { status: 403 });
    }

    user.lastLoginAt = new Date();
    await user.save();

    if (user.role === ROLES.SUPER_ADMIN) {
      await writeAudit({
        actor: user,
        action: "login",
        targetType: "User",
        targetId: String(user._id),
        description: "Super Admin logged in",
        request
      });
    }

    const token = signSession(user);
    return setSessionCookie(NextResponse.json({ ok: true, role: user.role }), token);
  } catch (error) {
    return NextResponse.json({ error: error.message || "Login failed." }, { status: 500 });
  }
}
