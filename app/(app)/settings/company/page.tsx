import { auth } from "@/auth";
import prisma from "@/shared/lib/prisma";

export default async function CompanyPage() {
  try {
    const session = await auth();

    return (
      <pre className="p-10">
        {JSON.stringify(session, null, 2)}
      </pre>
    );
  } catch (e) {
    return <pre>{String(e)}</pre>;
  }
}