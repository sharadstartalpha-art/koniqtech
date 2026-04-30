import Layout from "@/components/Layout";
import DashboardClient from "./DashboardClient";
import { getUser } from "@/lib/getUser";
import { hasAccess } from "@/lib/access";

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  const user = await getUser();
  if (!user) return <div>Unauthorized</div>;

  const allowed = await hasAccess(user.id, slug);

  return (
    <Layout slug={slug}>
      {!allowed ? (
        <div className="bg-white border rounded-md p-5 max-w-md">
          <p className="text-sm mb-3">
            You need an active subscription to use this product.
          </p>

          <a
            href={`/products/${slug}/subscribe`}
            className="bg-black text-white px-3 py-1.5 rounded-md text-sm"
          >
            Subscribe
          </a>
        </div>
      ) : (
        <DashboardClient slug={slug} />
      )}
    </Layout>
  );
}