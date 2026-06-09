import AuditLog from "@/models/AuditLog";

export async function writeAudit({ actor, action, targetType, targetId, description, request }) {
  await AuditLog.create({
    actorUserId: actor?._id || actor?.userId || null,
    actorRole: actor?.role || "SYSTEM",
    action,
    targetType,
    targetId,
    description,
    ipAddress: request?.headers.get("x-forwarded-for") || request?.headers.get("x-real-ip") || "",
    userAgent: request?.headers.get("user-agent") || ""
  });
}
