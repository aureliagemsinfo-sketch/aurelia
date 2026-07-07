export const SITE_NAME = "Aurelia Gems";
export const SITE_URL = "https://aureliagems.com";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
