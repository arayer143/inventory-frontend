"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProducts, createProduct, deleteProduct } from "@/utils/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useForm } from "react-hook-form"

type Product = {
  id: string
  name: string
  description: string
  price: number
  quantity: number
}

export default function Products() {
  const queryClient = useQueryClient()
  const form = useForm<Omit<Product, "id">>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
    },
  })

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: getProducts,
  })

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      form.reset()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  })

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center h-screen">An error occurred: {error.message}</div>

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Product description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Price"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Quantity"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Add Product</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => deleteMutation.mutate(product.id)} className="mr-2">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}