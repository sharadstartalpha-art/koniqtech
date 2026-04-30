import Layout from "@/components/Layout";
import DashboardClient from "./DashboardClient";
import { getUser } from "@/lib/getUser";
import { hasAccess } from "@/lib/access";

// ✅ REQUIRED (fixes your build error)
export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const allowed = await hasAccess(user.id, "invoice-recovery");

  return (
    <Layout>
      {!allowed ? (
        <div className="bg-white border border-gray-200 rounded-md p-5 max-w-md">
          <p className="text-sm text-gray-700 mb-3">
            You need an active subscription to use this product.
          </p>

          <a
            href="/products/invoice-recovery/subscribe"
            className="inline-flex items-center px-3 py-1.5 text-sm bg-black text-white rounded-md hover:opacity-90"
          >
            Subscribe
          </a>
        </div>
      ) : (
        <DashboardClient />
      )}
    </Layout>
  );
}