"use client";
import useSWR from "swr";
import { getProducts } from "@/lib/productService";

const fetcher = async () => {
  return await getProducts();
};

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR("products", fetcher);

  return {
    data: data || [],
    products: data || [],
    loading: isLoading,
    error,
    mutate,
  };
}
