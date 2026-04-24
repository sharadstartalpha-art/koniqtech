const roles = [
  "founder",
  "ceo",
  "cto",
  "marketing manager",
  "sales manager",
];

const industries = [
  "saas",
  "fintech",
  "healthcare",
  "real estate",
  "ecommerce",
];

const locations = [
  "usa",
  "new york",
  "california",
  "texas",
  "uk",
  "london",
  "germany",
  "berlin",
  "france",
  "paris",
  "netherlands",
];

export function generateSeedQueries(): string[] {
  const queries: string[] = [];

  for (const role of roles) {
    for (const industry of industries) {
      for (const location of locations) {
        queries.push(`${role} ${industry} ${location}`);
      }
    }
  }

  return queries;
}