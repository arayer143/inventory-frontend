import axios, { type AxiosError } from "axios"

export type Product = {
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
  },
  withCredentials: true,
})

export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log("Fetching products from:", api.defaults.baseURL)
    const response = await api.get<Product[]>("/products")
    console.log("Received products:", response.data)
    return response.data
  } catch (error) {
    handleApiError(error, "Error fetching products")
    throw error
  }
}

export const createProduct = async (product: Omit<Product, "id">): Promise<Product> => {
  try {
    const response = await api.post<Product>("/products", product)
    console.log("Created product:", response.data)
    return response.data
  } catch (error) {
    handleApiError(error, "Error creating product")
    throw error
  }
}

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  try {
    const response = await api.put<Product>(`/products/${id}`, product)
    console.log("Updated product:", response.data)
    return response.data
  } catch (error) {
    handleApiError(error, `Error updating product with id ${id}`)
    throw error
  }
}

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/products/${id}`)
    console.log("Deleted product with id:", id)
  } catch (error) {
    handleApiError(error, `Error deleting product with id ${id}`)
    throw error
  }
}

const handleApiError = (error: unknown, message: string) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError
    console.error(message, {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      config: {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        headers: axiosError.config?.headers,
      },
    })
    if (axiosError.response) {
      console.error("Response data:", axiosError.response.data)
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request)
    } else {
      console.error("Error setting up request:", axiosError.message)
    }
  } else {
    console.error(message, error)
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    handleApiError(error, "API Error")
    return Promise.reject(error)
  },
)

api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url)
    return config
  },
  (error) => {
    console.error("Request setup error:", error.message)
    return Promise.reject(error)
  },
)

export default api

