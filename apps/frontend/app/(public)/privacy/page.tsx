import { Footer } from "@/components/landing/footer";
import { LogoWithLink } from "@/components/landing/logo-with-link";
import { PrivacyPolicy } from "@/components/landing/privacy-policy";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MaxWidthWrapper>
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6 h-14 flex items-center">
          <LogoWithLink />
        </header>
        <main className="flex-1">
          <section className="w-full">
            <PrivacyPolicy
              companyName="Evolvant Systems"
              companyType="Private Limited"
              state="Tamil Nadu"
              contactEmail="support@aishorts.pro"
            />
          </section>
        </main>
        <Footer hideTerms />
      </MaxWidthWrapper>
    </div>
  );
}
