export type Permission = {
  module: string

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
  module: string
) {
  return permissions.find(
    (p) => p.module === module
  )
}

export function canView(
  permissions: any[],
  module: string,
  isOwner = false
) {
  if (isOwner) {
    return true
  }

  return permissions.some(
    p =>
      p.module === module &&
      p.canView
  )
}

export function canCreate(
  permissions: Permission[],
  module: string
) {
  const permission = getPermission(
    permissions,
    module
  )

  if (!permission) {
    return true
  }

  return permission.canCreate
}

export function canEdit(
  permissions: Permission[],
  module: string
) {
  const permission = getPermission(
    permissions,
    module
  )

  if (!permission) {
    return true
  }

  return permission.canEdit
}

export function canDelete(
  permissions: Permission[],
  module: string
) {
  const permission = getPermission(
    permissions,
    module
  )

  if (!permission) {
    return true
  }

  return permission.canDelete
}

export function canImport(
  permissions: Permission[],
  module: string
) {
  const permission = getPermission(
    permissions,
    module
  )

  if (!permission) {
    return true
  }

  return permission.canImport ?? false
}

export function canExport(
  permissions: Permission[],
  module: string
) {
  const permission = getPermission(
    permissions,
    module
  )

  if (!permission) {
    return true
  }

  return permission.canExport ?? false
}

export function canApprove(
  permissions: Permission[],
  module: string
) {
  const permission = getPermission(
    permissions,
    module
  )

  if (!permission) {
    return true
  }

  return permission.canApprove ?? false
}

export function canAssign(
  permissions: Permission[],
  module: string
) {
  const permission = getPermission(
    permissions,
    module
  )

  if (!permission) {
    return true
  }

  return permission.canAssign ?? false
}