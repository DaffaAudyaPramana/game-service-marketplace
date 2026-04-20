import { Card } from "@/components/ui/card"

export default function FeaturedGames() {
  return (
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-10">
        Featured Games
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">GTA V Online Enhanced & Legacy</Card>
        <Card className="p-6">Mobile Legends</Card>
        <Card className="p-6">PUBG Mobile</Card> *
      </div>
    </section>
  )
}