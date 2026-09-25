// shared/lib/locations.ts

/**
 * KoniqTech Location / Multi-Location Helpers
 *
 * Plan rules:
 *
 * PROFESSIONAL
 * - Maximum 1 location
 *
 * ENTERPRISE
 * - Multiple locations
 *
 * Employee limits are intentionally NOT handled here.
 * Employees are unlimited for Professional and Enterprise.
 */

export type LocationPlan =
  | "starter"
  | "professional"
  | "enterprise"
  | string
  | null
  | undefined

/**
 * Maximum number of locations allowed for a plan.
 *
 * null means unlimited.
 */
export function getLocationLimit(
  plan: LocationPlan
): number | null {
  const normalizedPlan = String(plan ?? "")
    .trim()
    .toLowerCase()

  switch (normalizedPlan) {
    case "enterprise":
      return null

    case "professional":
      return 1

    case "starter":
      return 1

    default:
      return 1
  }
}

/**
 * Returns true when the plan supports multiple locations.
 */
export function hasMultiLocationAccess(
  plan: LocationPlan
): boolean {
  const normalizedPlan = String(plan ?? "")
    .trim()
    .toLowerCase()

  return normalizedPlan === "enterprise"
}

/**
 * Returns true when another location can be created.
 *
 * Example:
 *
 * Professional + 0 locations -> true
 * Professional + 1 location  -> false
 *
 * Enterprise + any number     -> true
 */
export function canAddLocation(
  plan: LocationPlan,
  currentLocationCount: number
): boolean {
  const limit = getLocationLimit(plan)

  if (limit === null) {
    return true
  }

  return currentLocationCount < limit
}

/**
 * Returns the remaining number of locations.
 *
 * Enterprise returns null because the plan is unlimited.
 */
export function getRemainingLocations(
  plan: LocationPlan,
  currentLocationCount: number
): number | null {
  const limit = getLocationLimit(plan)

  if (limit === null) {
    return null
  }

  return Math.max(0, limit - currentLocationCount)
}

/**
 * Returns a human-readable location limit.
 */
export function getLocationLimitLabel(
  plan: LocationPlan
): string {
  const limit = getLocationLimit(plan)

  if (limit === null) {
    return "Multiple locations"
  }

  if (limit === 1) {
    return "1 location"
  }

  return `${limit} locations`
}

/**
 * Returns the plan required for multiple locations.
 */
export function getMultiLocationUpgradePlan(): "enterprise" {
  return "enterprise"
}

/**
 * Returns whether the user should be shown an upgrade prompt
 * when attempting to add another location.
 */
export function shouldShowLocationUpgrade(
  plan: LocationPlan,
  currentLocationCount: number
): boolean {
  return !canAddLocation(plan, currentLocationCount)
}

/**
 * Standard message shown when a Professional customer
 * reaches the one-location limit.
 */
export function getLocationLimitMessage(
  plan: LocationPlan
): string {
  const normalizedPlan = String(plan ?? "")
    .trim()
    .toLowerCase()

  if (normalizedPlan === "professional") {
    return (
      "Your Professional plan includes 1 location. " +
      "Upgrade to Enterprise to add multiple locations."
    )
  }

  if (normalizedPlan === "starter") {
    return (
      "Your current plan includes 1 location. " +
      "Upgrade to Enterprise to add multiple locations."
    )
  }

  return (
    "Your current plan does not allow additional locations. " +
    "Upgrade to Enterprise to add multiple locations."
  )
}

/**
 * Standard plan description for the UI.
 */
export function getLocationPlanDescription(
  plan: LocationPlan
): string {
  const normalizedPlan = String(plan ?? "")
    .trim()
    .toLowerCase()

  switch (normalizedPlan) {
    case "enterprise":
      return "Multiple locations"

    case "professional":
      return "1 location"

    case "starter":
      return "1 location"

    default:
      return "1 location"
  }
}

/**
 * Used by UI components to determine whether the
 * "Add Location" button should be enabled.
 */
export function getLocationAccess(
  plan: LocationPlan,
  currentLocationCount: number
) {
  const limit = getLocationLimit(plan)
  const canAdd = canAddLocation(
    plan,
    currentLocationCount
  )

  return {
    plan: String(plan ?? "")
      .trim()
      .toLowerCase(),

    limit,

    currentLocationCount,

    canAdd,

    multiLocation:
      hasMultiLocationAccess(plan),

    remaining:
      getRemainingLocations(
        plan,
        currentLocationCount
      ),

    showUpgrade:
      !canAdd,

    upgradePlan:
      !canAdd
        ? getMultiLocationUpgradePlan()
        : null,

    message:
      !canAdd
        ? getLocationLimitMessage(plan)
        : null,
  }
}