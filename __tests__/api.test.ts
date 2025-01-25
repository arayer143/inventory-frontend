import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { getProducts, createProduct, updateProduct, deleteProduct } from "../utils/api"

const mock = new MockAdapter(axios)

describe("API Tests", () => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

  beforeEach(() => {
    mock.reset()
    axios.defaults.baseURL = baseURL
  })

  describe("getProducts", () => {
    it("fetches products successfully", async () => {
      const mockProducts = [
        {
          id: "67952f5ddbfb99a952647bf6",
          name: "Test Product2",
          description: "A test product description",
          price: 29.99,
          quantity: 50,
        },
        {
          id: "67955754c511bcfd10cc545b",
          name: "New Product",
          description: "New Description",
          price: 30,
          quantity: 300,
        },
      ]

      mock.onGet("/products").reply(200, mockProducts)

      const products = await getProducts()
      expect(products).toEqual(expect.arrayContaining(mockProducts))
      expect(products.length).toBeGreaterThanOrEqual(mockProducts.length)
    })

    it("handles API errors", async () => {
      mock.onGet("/products").reply(500, { message: "Internal Server Error" })

      await expect(getProducts()).rejects.toThrow("Request failed with status code 500")
    })
  })

  describe("createProduct", () => {
    it("creates a product successfully", async () => {
      const newProduct = { name: "New Product", description: "New Description", price: 30, quantity: 300 }
      const createdProduct = { id: expect.any(String), ...newProduct }

      mock.onPost("/products").reply(201, createdProduct)

      const result = await createProduct(newProduct)
      expect(result).toMatchObject(createdProduct)
    })
  })

  describe("updateProduct", () => {
    it("updates a product successfully", async () => {
      const updatedProduct = {
        id: "67952f34dbfb99a952647bf4",
        name: "Updated Product",
        description: "Updated Description",
        price: 40,
        quantity: 400,
      }

      mock.onPut(`/products/${updatedProduct.id}`).reply(200, updatedProduct)

      const result = await updateProduct(updatedProduct.id, updatedProduct)
      expect(result).toEqual(updatedProduct)
    })

    it("handles invalid product ID", async () => {
      mock.onPut("/products/invalid-id").reply(400, "Invalid product ID")

      await expect(updateProduct("invalid-id", { name: "Test" })).rejects.toThrow("Request failed with status code 400")
    })
  })

  describe("deleteProduct", () => {
    it("deletes a product successfully", async () => {
      const productId = "67952f34dbfb99a952647bf4"
      mock.onDelete(`/products/${productId}`).reply(204)

      await expect(deleteProduct(productId)).resolves.not.toThrow()
    })

    it("handles invalid product ID", async () => {
      mock.onDelete("/products/invalid-id").reply(400, "Invalid product ID")

      await expect(deleteProduct("invalid-id")).rejects.toThrow("Request failed with status code 400")
    })
  })

  describe("CORS and Headers", () => {
    it("includes correct headers in requests", async () => {
      mock.onGet("/products").reply((config) => {
        expect(config.headers?.["Content-Type"]).toBe("application/json")
        expect(config.withCredentials).toBe(true)
        return [200, []]
      })

      await getProducts()
    })
  })
})

