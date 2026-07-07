import { Header } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <SiteFooter />
    </>
  );
}
