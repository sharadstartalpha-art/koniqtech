import prisma from "@/shared/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function OrganizationsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const q =
    typeof params.q === "string"
      ? params.q.trim()
      : "";

  const rawPage = Number(
    params.page ?? "1"
  );

  const page =
    Number.isFinite(rawPage) &&
    rawPage > 0
      ? Math.floor(rawPage)
      : 1;

  const limit = 10;

  const where = q
    ? {
        OR: [
          {
            name: {
              contains: q,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: q,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const [
    organizations,
    total,
  ] = await Promise.all([
    prisma.organization.findMany({
      where,

      include: {
        users: true,
      },

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.organization.count({
      where,
    }),
  ]);

  const pages = Math.max(
    1,
    Math.ceil(total / limit)
  );

return(

<div className="space-y-8">

<div className="flex justify-between">

<h1 className="text-4xl font-bold">

Organizations

</h1>

<form>

<input

name="q"

defaultValue={q}

placeholder="Search organization"

className="border p-4 rounded-xl w-80"

/>

</form>

</div>

<div className="bg-white rounded-3xl border overflow-hidden">

<table className="w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-5 text-left">

Company

</th>

<th>

CRM

</th>

<th>

Plan

</th>

<th>

Users

</th>

<th>

Expires

</th>

<th>

Action

</th>

</tr>

</thead>

<tbody>

{

organizations.map(org=>(

<tr

key={org.id}

className="border-t"

>

<td className="p-5">

{org.name}

</td>

<td>

{org.crmType}

</td>

<td>

{org.plan}

</td>

<td>

{org.users.length}

</td>

<td>

{

org.subscriptionEndsAt?.toDateString()

}

</td>

<td>

<Link

href={`/admin/organizations/${org.id}`}

className="text-blue-600"

>

Open

</Link>

</td>

</tr>

))

}

</tbody>

</table>

</div>

<div className="flex gap-3">

{

Array.from({

length:pages

}).map((_,i)=>(

<Link

key={i}

href={

`?page=${i+1}&q=${q}`

}

className="px-4 py-2 border rounded"

>

{i+1}

</Link>

))

}

</div>

</div>

)

}