export function isAdmin(user: any) {
  return user?.role === "ADMIN";
}

export function canManageUsers(role: string) {
  return role === "ADMIN";
}

export function canManageTeam(userRole: string) {
  return ["OWNER", "ADMIN"].includes(userRole);
}

export function canInvite(userRole: string) {
  return ["OWNER", "ADMIN"].includes(userRole);
}

export function canRemoveMember(userRole: string) {
  return userRole === "OWNER";
}

export function canChangeRole(userRole: string) {
  return userRole === "OWNER";
}