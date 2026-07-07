import type { MetadataRoute } from "next";

import { collections } from "@/data/collections";
import { gemstones } from "@/data/gemstones";
import { jewellery } from "@/data/jewellery";
import { journalEntries } from "@/data/journal";
import { absoluteUrl } from "@/lib/site";

const staticRoutes = ["", "/collections", "/jewellery", "/gemstones", "/journal", "/bespoke", "/appointment", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-22");
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
  const detailEntries: MetadataRoute.Sitemap = [
    ...collections.map(({ slug }) => `/collections/${slug}`),
    ...jewellery.map(({ slug }) => `/jewellery/${slug}`),
    ...gemstones.map(({ slug }) => `/gemstones/${slug}`),
    ...journalEntries.map(({ slug }) => `/journal/${slug}`),
  ].map((path) => ({ url: absoluteUrl(path), lastModified, changeFrequency: "monthly", priority: 0.7 }));

  return [...staticEntries, ...detailEntries];
}
