import React, { useEffect, useState } from "react"
import { fetchProducts } from "@/app/api/products"

interface Product {
  id: number
  name: string
  // Add other properties as needed
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await fetchProducts()
        setProducts(fetchedProducts)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (isLoading) {
    return <div>Loading products...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  )
}
