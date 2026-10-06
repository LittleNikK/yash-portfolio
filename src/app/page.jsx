import Navbar from "@/components/navbar/page";
import Hero from "@/components/hero/page";
import WorksSection from "@/components/works/page";
import AboutSection from "@/components/About/page";
import SkillsetSection from "@/components/skills/page";
import ContactSection from "@/components/contact/page";
import ProductsSection from "@/components/products/page";
import Footer from "@/components/footer/page";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <Navbar />
      <main className="flex flex-1 flex-col w-full">
        <Hero />
        <WorksSection />
        <AboutSection />
        <SkillsetSection />
        <ContactSection />
        <ProductsSection />
      </main>
      <Footer />
    </div>
  );
}
