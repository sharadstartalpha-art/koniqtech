import type { ModuleName } from "@/shared/constants/modules";

export type Permission = {
  module: ModuleName

  canView: boolean

  canCreate: boolean

  canEdit: boolean

  canDelete: boolean

  canImport?: boolean

  canExport?: boolean

  canApprove?: boolean

  canAssign?: boolean
}

function getPermission(
  permissions: Permission[],
  module: ModuleName
) {
  return permissions.find(
    (p) => p.module === module
  )
}

export function canView(
  permissions: Permission[],
  module: ModuleName,
  isOwner = false
) {
  if (isOwner) {
    return true;
  }

  const permission = permissions.find(
    (p) => p.module === module
  );

  if (!permission) {
    return false;
  }

  return permission.canView;
}

export function canCreate(
  permissions: Permission[],
 module: ModuleName,
  isOwner = false
) {
  if (isOwner) {
    return true;
  }

  const permission = getPermission(permissions, module);

  if (!permission) {
    return false;
  }

  return permission.canCreate;
}

export function canEdit(
  permissions: Permission[],
 module: ModuleName,
  isOwner = false
) {
  if (isOwner) {
    return true;
  }

  const permission = getPermission(permissions, module);

  if (!permission) {
    return false;
  }

  return permission.canEdit;
}

export function canDelete(
  permissions: Permission[],
  module: ModuleName,
  isOwner = false
) {
  if (isOwner) {
    return true;
  }

  const permission = getPermission(permissions, module);

  if (!permission) {
    return false;
  }

  return permission.canDelete;
}

export function canImport(
  permissions: Permission[],
 module: ModuleName,
  isOwner = false
) {
  if (isOwner) {
    return true;
  }

  const permission = getPermission(permissions, module);

  if (!permission) {
    return false;
  }

  return permission.canImport ?? false;
}

export function canExport(
  permissions: Permission[],
  module: ModuleName,
  isOwner = false
) {
  if (isOwner) {
    return true;
  }

  const permission = getPermission(permissions, module);

  if (!permission) {
    return false;
  }

  return permission.canExport ?? false;
}

export function canApprove(
  permissions: Permission[],
  module: ModuleName,
  isOwner = false
) {
  if (isOwner) {
    return true;
  }

  const permission = getPermission(permissions, module);

  if (!permission) {
    return false;
  }

  return permission.canApprove ?? false;
}

export function canAssign(
  permissions: Permission[],
  module: ModuleName,
  isOwner = false
) {
  if (isOwner) {
    return true;
  }

  const permission = getPermission(permissions, module);

  if (!permission) {
    return false;
  }

  return permission.canAssign ?? false;
}