import axios, { type AxiosError } from "axios"

// Define the Product type
type Product = {
  id: string
  name: string
  description: string
  price: number
  quantity: number
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.NEXT_PUBLIC_AUTH_TOKEN || "",
  },
})

export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log("Fetching products from:", api.defaults.baseURL)
    const response = await api.get<Product[]>("/products")
    console.log("Received products:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

export const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  try {
    const response = await api.post<Product>("/products", product)
    console.log("Created product:", response.data)
    return response.data
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  try {
    const response = await api.put<Product>(`/products/${id}`, product)
    console.log("Updated product:", response.data)
    return response.data
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/products/${id}`)
    console.log("Deleted product with id:", id)
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data)
      console.error("Request URL:", error.config?.url)
      console.error("Request Method:", error.config?.method)
      console.error("Request Headers:", error.config?.headers)
    } else if (error.request) {
      console.error("No response received:", error.request)
    } else {
      console.error("Error setting up request:", error.message)
    }
    return Promise.reject(error)
  },
)

export default api
