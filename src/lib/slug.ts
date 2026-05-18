export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\u0400-\u04ff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
