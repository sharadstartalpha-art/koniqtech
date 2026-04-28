import Layout from "@/components/Layout";
import DashboardClient from "./DashboardClient";
import { getUser } from "@/lib/getUser";
import { hasAccess } from "@/lib/access";

export default async function Page() {
  const user = await getUser();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  const allowed = await hasAccess(user.id, "invoice-recovery");

  return (
    <Layout>
      {!allowed ? (
        <div className="bg-white border rounded-lg p-6 max-w-md">
          <p className="text-gray-600 mb-4">
            You need a subscription to use this product.
          </p>

          <a
            href="/products/invoice-recovery/subscribe"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Subscribe Now
          </a>
        </div>
      ) : (
        <DashboardClient />
      )}
    </Layout>
  );
}