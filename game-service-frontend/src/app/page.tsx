import Navbar from "@/components/layout/navbar"
import Hero from "@/components/sections/hero"
import FeaturedGames from "@/components/sections/featured-games"
import HowItWorks from "@/components/sections/how-it-works"

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Hero/>
      <FeaturedGames/>
      <HowItWorks/>
    </main>
  )
}