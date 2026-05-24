export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  BUSINESS_OWNER: "BUSINESS_OWNER",
  STAFF: "STAFF"
};

export const DEFAULT_STAFF_PERMISSIONS = {
  canEditProducts: false,
  canViewLeads: true,
  canDownloadQR: true,
  canEditAvailability: true
};

export function isSuperAdmin(user) {
  return user?.role === ROLES.SUPER_ADMIN;
}

export function isBusinessOwner(user) {
  return user?.role === ROLES.BUSINESS_OWNER;
}

export function isStaff(user) {
  return user?.role === ROLES.STAFF;
}

export function canAccessBusiness(user, businessId) {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return String(user.businessId || "") === String(businessId || "");
}

export function canStaff(user, permission) {
  if (isSuperAdmin(user) || isBusinessOwner(user)) return true;
  return Boolean(user?.permissions?.[permission]);
}
