export function parseImdbTitleIdFromUrl(text: string | undefined | null): string | null {
  if (!text) return null;

  const split = text.split('/');
  const imdbRegex = new RegExp(/^tt[a-z0-9]{4,11}$/i);

  return split.find((item) => imdbRegex.test(item)) ?? null;
}
