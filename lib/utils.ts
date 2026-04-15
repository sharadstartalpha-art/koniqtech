export function extractDomain(company: string) {
  return company
    .toLowerCase()
    .replace(/[^a-z]/g, "") + ".com";
}