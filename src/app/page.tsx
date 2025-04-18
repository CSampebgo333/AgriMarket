import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedProducts } from "@/components/landing/featured-products"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Testimonials } from "@/components/landing/testimonials"
import { Footer } from "@/components/layout/footer"
import { LandingNavbar } from "@/components/layout/landing-navbar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}