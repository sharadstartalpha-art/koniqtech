export async function enrichCompany(domain: string) {
  try {
    const res = await fetch(
      `https://company.clearbit.com/v2/companies/find?domain=${domain}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLEARBIT_API_KEY}`,
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();

    return {
      name: data.name,
      industry: data.category?.industry,
      size: data.metrics?.employees,
      linkedin: data.linkedin?.handle,
      website: data.domain,
    };
  } catch {
    return null;
  }
}