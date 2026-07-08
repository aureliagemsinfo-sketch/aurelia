import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing. Gemstone CMS verification was not run.");
    process.exitCode = 1;
    return;
  }

  const [{ gemstones: staticGemstones }, repo, publicData] = await Promise.all([
    import("../src/data/gemstones"),
    import("../src/server/repositories/gemstones.repo"),
    import("../src/server/public-data/gemstones.public"),
  ]);

  const [adminGemstones, publicGemstones, featuredGemstones] = await Promise.all([
    repo.listAdminGemstones(),
    publicData.listPublicGemstonesWithFallback(),
    publicData.listPublicFeaturedGemstonesWithFallback(100),
  ]);

  const staticSlugs = new Set(staticGemstones.map((gemstone) => gemstone.slug));
  const adminSlugs = new Set(adminGemstones.map((gemstone) => gemstone.slug));
  const publicSlugs = new Set(publicGemstones.map((gemstone) => gemstone.slug));
  const missingStaticSlugs = [...staticSlugs].filter((slug) => !adminSlugs.has(slug));
  const duplicateOrders = adminGemstones
    .map((gemstone) => gemstone.sortOrder)
    .filter((order, index, orders) => orders.indexOf(order) !== index);
  const draftVisibleSlugs = adminGemstones
    .filter((gemstone) => !gemstone.isPublished && publicSlugs.has(gemstone.slug))
    .map((gemstone) => gemstone.slug);
  const publishedDbSlugsInOrder = adminGemstones
    .filter((gemstone) => gemstone.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    .map((gemstone) => gemstone.slug);
  const publicDbSlugsInOrder = publicGemstones
    .map((gemstone) => gemstone.slug)
    .filter((slug) => adminSlugs.has(slug));
  const orderMatches = publishedDbSlugsInOrder.join("|") === publicDbSlugsInOrder.join("|");

  console.log(`Static gemstone count: ${staticGemstones.length}`);
  console.log(`Admin DB gemstone count: ${adminGemstones.length}`);
  console.log(`Published DB gemstone count: ${publishedDbSlugsInOrder.length}`);
  console.log(`Public gemstone count: ${publicGemstones.length}`);
  console.log(`Featured public gemstone count: ${featuredGemstones.length}`);
  console.log(`Missing static slugs in DB: ${missingStaticSlugs.length ? missingStaticSlugs.join(", ") : "none"}`);
  console.log(`Duplicate display orders: ${duplicateOrders.length ? [...new Set(duplicateOrders)].join(", ") : "none"}`);
  console.log(`Draft slugs visible publicly: ${draftVisibleSlugs.length ? draftVisibleSlugs.join(", ") : "none"}`);
  console.log(`Public DB order matches admin DB order: ${orderMatches ? "yes" : "no"}`);

  if (missingStaticSlugs.length || duplicateOrders.length || draftVisibleSlugs.length || !orderMatches) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Gemstone CMS verification failed.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exitCode = 1;
});
