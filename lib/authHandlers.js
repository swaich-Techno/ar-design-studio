import { NextResponse } from "next/server";
import { connectDB, isDatabaseError } from "@/lib/mongodb";
import { ensureEnvSuperAdmin, hashPassword, setSessionCookie, signSession, verifyPassword } from "@/lib/auth";
import { writeAudit } from "@/lib/audit";
import { cataloguePublicUrl, generateQrDataUrl } from "@/lib/qr";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { planDefaults } from "@/lib/plans";
import { ROLES } from "@/lib/permissions";
import { rolesForPortal } from "@/lib/loginPortal";
import { LIMITS, clientIp, rateLimit, tooMany } from "@/lib/rateLimit";
import { jsonPublicError, logServerError, makeErrorRef } from "@/lib/requestContext";
import { logSecurity } from "@/lib/securityLog";
import { clip } from "@/lib/textSafe";
import Business from "@/models/Business";
import User from "@/models/User";

function json(data, status = 200, headers = {}) {
  return NextResponse.json(data, { status, headers });
}

function validEmail(email) {
  return email.includes("@") && email.includes(".") && email.length <= 120;
}

function infraUnavailable(route, error) {
  const errorRef = makeErrorRef();
  logServerError({ requestId: errorRef, errorRef, route, error });
  const authSecret = error?.code === "AUTH_SECRET_MISSING";
  const message = authSecret || isDatabaseError(error) ? "Sign-in is temporarily unavailable." : "Sign-in is temporarily unavailable.";
  return jsonPublicError(message, 503, errorRef);
}

export async function handleLoginRequest(request) {
  const ip = clientIp(request);
  const limited = rateLimit(`login:${ip}`, LIMITS.login);
  if (!limited.ok) {
    logSecurity("login_throttled", { ip });
    const fail = tooMany(limited.retryAfterSec);
    return json(fail.body, fail.status, fail.headers);
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").toLowerCase().trim();
  const password = String(body.password || "");
  const portal = String(body.role || "").trim();
  const allowed = rolesForPortal(portal);

  if (!email || !password || !allowed) {
    return json({ error: "Invalid credentials." }, 401);
  }
  if (!validEmail(email)) {
    return json({ error: "Enter a valid email address." }, 400);
  }

  let user;
  try {
    await connectDB();
    if (portal === ROLES.SUPER_ADMIN) {
      try {
        user = await ensureEnvSuperAdmin(email);
      } catch {
        logSecurity("login_failed", { ip, portal });
        return json({ error: "Invalid credentials." }, 401);
      }
    } else {
      user = await User.findOne({ email, role: { $in: allowed } });
    }
  } catch (error) {
    if (error?.code === "AUTH_SECRET_MISSING" || isDatabaseError(error)) {
      return infraUnavailable("auth/login/db", error);
    }
    logSecurity("login_failed", { ip, portal });
    return json({ error: "Invalid credentials." }, 401);
  }

  if (!user || user.isActive === false) {
    logSecurity("login_failed", { ip, portal });
    return json({ error: "Invalid credentials." }, 401);
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    logSecurity("login_failed", { ip, portal, userId: String(user._id) });
    return json({ error: "Invalid credentials." }, 401);
  }

  try {
    user.lastLoginAt = new Date();
    await user.save();
  } catch (saveError) {
    logServerError({ requestId: makeErrorRef(), errorRef: makeErrorRef(), route: "auth/login/save", error: saveError });
  }

  if (user.role === ROLES.SUPER_ADMIN) {
    try {
      await writeAudit({
        actor: user,
        action: "login",
        targetType: "User",
        targetId: String(user._id),
        description: "Super Admin logged in",
        request
      });
    } catch (auditError) {
      logServerError({ requestId: makeErrorRef(), errorRef: makeErrorRef(), route: "auth/login/audit", error: auditError });
    }
  }

  try {
    logSecurity("login_ok", { ip, portal, role: user.role, userId: String(user._id) });
    const token = signSession(user);
    return setSessionCookie(json({ ok: true, role: user.role }), token);
  } catch (error) {
    return infraUnavailable("auth/login/session", error);
  }
}

export async function handleRegisterRequest(request) {
  const ip = clientIp(request);
  const limited = rateLimit(`register:${ip}`, LIMITS.register);
  if (!limited.ok) {
    const fail = tooMany(limited.retryAfterSec);
    return json(fail.body, fail.status, fail.headers);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const required = ["businessName", "ownerName", "email", "password", "whatsapp"];
    for (const key of required) {
      if (!body[key]) return json({ error: `${key} is required.` }, 400);
    }

    const email = String(body.email).toLowerCase().trim();
    const password = String(body.password || "");
    if (!validEmail(email)) return json({ error: "Enter a valid email address." }, 400);
    if (password.length < 8 || password.length > 128) return json({ error: "Password must be 8–128 characters." }, 400);

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) return json({ error: "An account with this email already exists." }, 409);

    const businessName = clip(body.businessName, 120);
    const ownerName = clip(body.ownerName, 80);
    const baseSlug = slugify(businessName);
    let slug = baseSlug;
    if (await Business.exists({ slug })) slug = uniqueSlug(businessName, Date.now().toString());

    const starterDefaults = planDefaults("Starter");
    const business = await Business.create({
      businessName,
      ownerName,
      email,
      phone: clip(body.phone, 20),
      whatsapp: clip(body.whatsapp, 20),
      category: clip(body.category || "Restaurant", 40) || "Restaurant",
      slug,
      ...starterDefaults,
      subscriptionStatus: "TRIAL",
      usedStorageMB: 0,
      isActive: true
    });

    const user = await User.create({
      name: ownerName,
      email,
      passwordHash: await hashPassword(password),
      role: ROLES.BUSINESS_OWNER,
      businessId: business._id,
      isActive: true
    });

    try {
      await generateQrDataUrl(cataloguePublicUrl(business.slug));
    } catch (qrError) {
      logServerError({ requestId: makeErrorRef(), errorRef: makeErrorRef(), route: "auth/register/qr", error: qrError });
    }

    logSecurity("register_ok", { ip, businessId: String(business._id) });
    const token = signSession(user);
    return setSessionCookie(json({ ok: true, businessSlug: business.slug }), token);
  } catch (error) {
    if (error?.code === 11000) {
      return json({ error: "An account with this email already exists." }, 409);
    }
    if (error?.name === "ValidationError") {
      return json({ error: "Check the details and try again." }, 400);
    }
    const errorRef = makeErrorRef();
    logServerError({ requestId: errorRef, errorRef, route: "auth/register", error });
    if (error?.code === "AUTH_SECRET_MISSING" || isDatabaseError(error)) {
      return jsonPublicError("Registration is temporarily unavailable.", 503, errorRef);
    }
    return jsonPublicError("Registration is temporarily unavailable.", 500, errorRef);
  }
}
