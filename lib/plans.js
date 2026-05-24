export const PLAN_LIMITS = {
  Starter: {
    productLimit: 10,
    staffLimit: 1,
    storageLimitMB: 250,
    imageMaxSizeMB: 1,
    arProductLimit: 0,
    label: "Image catalogue only"
  },
  Growth: {
    productLimit: 25,
    staffLimit: 3,
    storageLimitMB: 1000,
    imageMaxSizeMB: 2,
    arProductLimit: 5,
    label: "Up to 5 AR/3D products"
  },
  Premium: {
    productLimit: 50,
    staffLimit: 10,
    storageLimitMB: 3000,
    imageMaxSizeMB: 5,
    arProductLimit: 15,
    label: "Up to 15 AR/3D products"
  }
};

export function getPlanLimits(plan = "Starter") {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.Starter;
}

export function planDefaults(plan = "Starter") {
  const subscriptionPlan = PLAN_LIMITS[plan] ? plan : "Starter";
  const limits = getPlanLimits(subscriptionPlan);
  return {
    subscriptionPlan,
    productLimit: limits.productLimit,
    staffLimit: limits.staffLimit,
    storageLimitMB: limits.storageLimitMB,
    arProductLimit: limits.arProductLimit
  };
}

export function percentUsed(used = 0, limit = 0) {
  if (!limit) return used > 0 ? 100 : 0;
  return Math.min(100, Math.round((Number(used || 0) / Number(limit)) * 100));
}

export function mb(value = 0) {
  return Math.round(Number(value || 0) * 100) / 100;
}
