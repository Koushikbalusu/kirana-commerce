import slugify from 'slugify';

export function generateSlug(name: string): string {
  const base = slugify(name, { lower: true, strict: true });
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}
