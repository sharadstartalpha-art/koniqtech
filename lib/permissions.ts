export const ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

/**
 * 🔐 ROLE CHECK
 */
export function hasRole(userRole: string, allowed: string[]) {
  return allowed.includes(userRole);
}

/**
 * 👑 OWNER ONLY
 */
export function isOwner(role: string) {
  return role === ROLES.OWNER;
}

/**
 * ⚙️ ADMIN ACCESS
 */
export function canManageTeam(role: string) {
  return role === ROLES.OWNER || role === ROLES.ADMIN;
}

/**
 * 👥 INVITE PERMISSION
 */
export function canInvite(role: string) {
  return role === ROLES.OWNER || role === ROLES.ADMIN;
}

/**
 * ❌ REMOVE MEMBER
 */
export function canRemove(role: string) {
  return role === ROLES.OWNER;
}