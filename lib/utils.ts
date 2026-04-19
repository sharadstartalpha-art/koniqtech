/* ============================= */
/* DOMAIN EXTRACTION             */
/* ============================= */
export function extractDomain(company: string): string {
  if (!company) return "";

  const clean = company
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  return clean ? `${clean}.com` : "";
}

/* ============================= */
/* CONCURRENCY RUNNER            */
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

    // When limit reached, wait for one to finish
    if (executing.size >= limit) {
      await Promise.race(executing);
    }

    // Cleanup finished promises
    p.finally(() => executing.delete(p));
  }

  await Promise.all(executing);
  return results;
}