import type { Metadata } from "next"
import { siteDescription, siteTitle } from "@/lib/seo"

// import Navbar from "@/components/layout/navbar"
// import FeaturedGames from "@/components/sections/featured-games"
// import HowItWorks from "@/components/sections/how-it-works"
// import GTAVPage from "@/app/games/gta-v/page"
// import ServiceCard from "@/components/custom/service-card"

import Hero from "@/components/sections/hero"
import GTAServicesSection from "@/components/sections/gtaservices"
import TestimoniSection from "@/components/sections/testimoni-section"
import FeedbackSection from "@/components/sections/feedback-section"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "HyperIndo Store",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function Home() {
  return (
    <main>
      {/* <Navbar/> */}
      <Hero/>
      {/* <FeaturedGames/> */}
      {/* <HowItWorks/> */}
      {/* <GTAVPage/> */}
      {/* <ServiceCard/> */}
      <GTAServicesSection/>
      <TestimoniSection/>
      <FeedbackSection/>
    </main>
  )
}