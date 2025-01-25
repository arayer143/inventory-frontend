import axios, { AxiosError } from 'axios'

// Assuming you have a type definition for Product
interface Product {
  id: number
  name: string
  // Add other properties as needed
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 5000, // 5 seconds timeout
})

export async function fetchProducts(): Promise<Product[]> {
  try {
    console.log("Fetching products from:", api.defaults.baseURL)
    const response = await api.get<Product[]>("/products")
    console.log("Received products:", response.data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      console.error("Axios error:", axiosError.message)
      console.error("Status:", axiosError.response?.status)
      console.error("Status Text:", axiosError.response?.statusText)
      console.error("Response data:", axiosError.response?.data)
      
      if (axiosError.code === 'ECONNABORTED') {
        throw new Error("Request timed out. Please check your network connection.")
      }
      
      if (axiosError.response?.status === 404) {
        throw new Error("Products endpoint not found. Please check your API configuration.")
      }
      
      throw new Error(`Failed to fetch products: ${axiosError.message}`)
    } else {
      console.error("Unexpected error:", error)
      throw new Error("An unexpected error occurred while fetching products.")
    }
  }
}
