/* ============================= */
/* 🔤 NORMALIZE STRINGS          */
/* ============================= */
export function normalize(str?: string | null): string | null {
  if (!str) return null;

  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_");
}

/* ============================= */
/* 🌐 DOMAIN EXTRACTION          */
/* ============================= */
export function extractDomain(company?: string | null): string {
  if (!company) return "";

  const clean = company
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return clean ? `${clean}.com` : "";
}

/* ============================= */
/* ⚡ CONCURRENCY RUNNER          */
/* ============================= */
export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit = 5
): Promise<T[]> {
  const results: T[] = [];
  const executing = new Set<Promise<void>>();

  for (const task of tasks) {
    const p = task().then((res) => {
      results.push(res);
    });

    executing.add(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }

    p.finally(() => executing.delete(p));
  }

  await Promise.all(executing);
  return results;
}