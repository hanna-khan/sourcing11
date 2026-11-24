import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollChrome } from "@/components/layout/ScrollChrome";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { Analytics } from "@/components/analytics/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSettings } from "@/lib/content";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-pill bg-gold px-5 py-3 text-sm font-semibold text-navy-deep transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <ScrollChrome />
      <MotionProvider />
      <Analytics />
      <JsonLd data={[organizationSchema(settings), websiteSchema()]} />
    </>
  );
}
