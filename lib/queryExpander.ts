const modifiers = [
  "top",
  "best",
  "list of",
  "directory",
  "companies",
];

export function expandQuery(base: string): string[] {
  return modifiers.map((m) => `${m} ${base}`);
}