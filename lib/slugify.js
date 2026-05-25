export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueSlug(base, suffix = "") {
  const clean = slugify(base);
  const extra = suffix ? `-${slugify(suffix).slice(0, 8)}` : "";
  return `${clean || "item"}${extra}`;
}
