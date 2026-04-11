export function canAccessAdmin(user: any) {
  return user?.role === "ADMIN";
}

export function canManageWorkspace(user: any) {
  return user?.role === "ADMIN" || user?.role === "TEAM";
}

export function canManageUsers(role: string) {
  return role === "ADMIN";
}

export function canInvite(role: string) {
  return role === "ADMIN" || role === "TEAM";
}