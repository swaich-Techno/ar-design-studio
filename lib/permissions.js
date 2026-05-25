export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  TEAM_ADMIN: "TEAM_ADMIN",
  FINANCE_MANAGER: "FINANCE_MANAGER",
  AR_MANAGER: "AR_MANAGER",
  SUPPORT_STAFF: "SUPPORT_STAFF",
  BUSINESS_OWNER: "BUSINESS_OWNER",
  BUSINESS_MANAGER: "BUSINESS_MANAGER",
  BUSINESS_STAFF: "BUSINESS_STAFF",
  STAFF: "STAFF"
};

export const DEFAULT_STAFF_PERMISSIONS = {
  canEditProducts: false,
  canViewLeads: true,
  canDownloadQR: true,
  canEditAvailability: true,
  canManageOrders: false,
  canManageCampaigns: false
};

export const INTERNAL_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.TEAM_ADMIN,
  ROLES.FINANCE_MANAGER,
  ROLES.AR_MANAGER,
  ROLES.SUPPORT_STAFF
];

export const TEAM_LOGIN_ROLES = [
  ROLES.TEAM_ADMIN,
  ROLES.FINANCE_MANAGER,
  ROLES.AR_MANAGER,
  ROLES.SUPPORT_STAFF
];

export const BUSINESS_LOGIN_ROLES = [
  ROLES.BUSINESS_OWNER,
  ROLES.BUSINESS_MANAGER
];

export const STAFF_LOGIN_ROLES = [
  ROLES.BUSINESS_MANAGER,
  ROLES.BUSINESS_STAFF,
  ROLES.STAFF
];

export const CLIENT_ROLES = [
  ROLES.BUSINESS_OWNER,
  ROLES.BUSINESS_MANAGER,
  ROLES.BUSINESS_STAFF,
  ROLES.STAFF
];

export function isSuperAdmin(user) {
  return user?.role === ROLES.SUPER_ADMIN;
}

export function isInternalTeam(user) {
  return INTERNAL_ROLES.includes(user?.role);
}

export function canManageFinance(user) {
  return [ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN, ROLES.FINANCE_MANAGER].includes(user?.role);
}

export function canApproveContent(user) {
  return [ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN, ROLES.AR_MANAGER].includes(user?.role);
}

export function canSupportClients(user) {
  return [ROLES.SUPER_ADMIN, ROLES.TEAM_ADMIN, ROLES.SUPPORT_STAFF, ROLES.AR_MANAGER].includes(user?.role);
}

export function isBusinessOwner(user) {
  return user?.role === ROLES.BUSINESS_OWNER;
}

export function isStaff(user) {
  return STAFF_LOGIN_ROLES.includes(user?.role);
}

export function canAccessBusiness(user, businessId) {
  if (!user) return false;
  if (isInternalTeam(user)) return true;
  return String(user.businessId || "") === String(businessId || "");
}

export function canStaff(user, permission) {
  if (isInternalTeam(user) || isBusinessOwner(user) || user?.role === ROLES.BUSINESS_MANAGER) return true;
  return Boolean(user?.permissions?.[permission]);
}
