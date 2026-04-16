export function personalize(template: string, recipient: any) {
  if (!template) return "";

  return template
    .replace(/{{\s*name\s*}}/gi, recipient?.name || "there")
    .replace(/{{\s*email\s*}}/gi, recipient?.email || "")
    .replace(/{{\s*company\s*}}/gi, recipient?.company || "")
    .trim();
}