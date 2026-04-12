// src/components/layout/navbar.tsx
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <h1 className="text-xl font-bold">LootFlow</h1>

      <div className="flex gap-4">
        <Button variant="ghost">Login</Button>
        <Button>Register</Button>
      </div>
    </nav>
  )
}