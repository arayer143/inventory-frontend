import Products from "@/components/Products"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Inventory Management System</h1>
      <Products />
    </main>
  )
}

