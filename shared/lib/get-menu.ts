import { SubscriptionPlan } from "@prisma/client";
import { MENU } from "@/config/sidebar";
import { PLAN_FEATURES } from "@/shared/config/plan-features";

export function getMenuForPlan(
  plan?: SubscriptionPlan
) {
  const features =
    PLAN_FEATURES[plan ?? SubscriptionPlan.starter];

  return MENU
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        switch (item.href) {
          case "/crew":
            return features.crew;

          case "/jobs/dispatch":
            return features.dispatch;

          case "/inventory":
            return features.inventory;

          case "/reports":
            return features.reports;

          case "/ai":
            return features.automation;

          case "/developer":
            return features.api;

          default:
            return true;
        }
      }),
    }))
    .filter((section) => section.items.length > 0);
}