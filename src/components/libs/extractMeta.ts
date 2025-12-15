type CheerioAPI = import("cheerio").CheerioAPI;

/**
 * URLからtitle,desc,image
 */
export function pickMeta($: CheerioAPI, base: URL) {
  const get = (sel: string) => $(sel).attr("content") || "";
  const txt = (sel: string) => $(sel).text().trim();
  const firstNonEmpty = (...vals: string[]) => vals.find(Boolean) || "";

  const title = firstNonEmpty(
    get('meta[property="og:title"]'),
    get('meta[name="twitter:title"]'),
    txt("title")
  );

  const description = firstNonEmpty(
    get('meta[property="og:description"]'),
    get('meta[name="twitter:description"]'),
    get('meta[name="description"]')
  );

  const imageRaw = firstNonEmpty(
    get('meta[property="og:image"]'),
    get('meta[name="twitter:image"]')
  );

  let image = "";

  // 相対パスを絶対パスに
  if (imageRaw) image = new URL(imageRaw, base).toString();

  return { title, description, image };
}
