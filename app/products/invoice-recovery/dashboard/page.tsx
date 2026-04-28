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

  if (!allowed) {
    return (
      <Layout>
        <div className="bg-white p-6 rounded-xl shadow max-w-md">
          <p className="mb-4 text-gray-600">
            You need a subscription to use this product.
          </p>

          <a
            href="/products/invoice-recovery/subscribe"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg inline-block"
          >
            Subscribe Now
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <DashboardClient />
      </div>
    </Layout>
  );
}