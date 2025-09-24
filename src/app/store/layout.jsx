'use client'
import { ProductProvider } from '../context/ProductContext';

export default function StoreLayout({ children }) {
  return (
    <ProductProvider>
      {children}
    </ProductProvider>
  );
}