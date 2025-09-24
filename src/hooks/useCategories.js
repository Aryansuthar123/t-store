"use client";
import useSWR from "swr";
import { getCategories } from "@/lib/categoryService"; 


const fetcher = async () => {
  return await getCategories();
};

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR("categories", fetcher);

  return {
    data: data || [],      
    categories: data || [],  
    loading: isLoading,
    error,
    mutate,                 
  };
}
