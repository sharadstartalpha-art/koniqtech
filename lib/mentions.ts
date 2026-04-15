export function extractMentions(text: string) {
  const matches = text.match(/@(\w+)/g) || [];
  return matches.map((m) => m.replace("@", ""));
}