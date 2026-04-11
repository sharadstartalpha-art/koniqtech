import { prisma } from "@/lib/prisma";

export default async function CampaignDetail({ params }: any) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: { steps: true },
  });

  return (
    <div className="max-w-4xl mx-auto py-10">

      <h1 className="text-xl font-bold">{campaign?.name}</h1>

      <div className="mt-6 space-y-4">
        {campaign?.steps.map((s) => (
          <div key={s.id} className="bg-white p-4 border rounded">
            <p>Day {s.delay}</p>
            <p>{s.subject}</p>
          </div>
        ))}
      </div>

    </div>
  );
}