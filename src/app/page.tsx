import { Header } from "@/components/layout/Header";
import { BoutiqueBanner } from "@/components/sections/BoutiqueBanner";
import { CreationCategoryGrid } from "@/components/sections/CreationCategoryGrid";
import { DarkCampaignSection } from "@/components/sections/DarkCampaignSection";
import { FullBleedStorySection } from "@/components/sections/FullBleedStorySection";
import { GiftCampaignSection } from "@/components/sections/GiftCampaignSection";
import { HeritageSplitSection } from "@/components/sections/HeritageSplitSection";
import { HeroVideoSection } from "@/components/sections/HeroVideoSection";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { ProductModelSplitSection } from "@/components/sections/ProductModelSplitSection";
import { ServicesNewsletterFooter } from "@/components/sections/ServicesNewsletterFooter";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroVideoSection />
        <FullBleedStorySection />
        <HeritageSplitSection />
        <DarkCampaignSection />
        <ProductModelSplitSection />
        <BoutiqueBanner />
        <GiftCampaignSection />
        <CreationCategoryGrid />
        <JournalPreview />
      </main>
      <ServicesNewsletterFooter />
    </>
  );
}
