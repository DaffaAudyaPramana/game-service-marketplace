import Navbar from "@/components/layout/navbar"
import Hero from "@/components/sections/hero"
import FeaturedGames from "@/components/sections/featured-games"
import HowItWorks from "@/components/sections/how-it-works"
// import GTAVPage from "@/app/games/gta-v/page"
// import ServiceCard from "@/components/custom/service-card"

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Hero/>
      <FeaturedGames/>
      <HowItWorks/>
      {/* <GTAVPage/> */}
      {/* <ServiceCard/> */}
    </main>
  )
}