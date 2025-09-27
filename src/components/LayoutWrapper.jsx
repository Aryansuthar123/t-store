'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';


const showHeaderRoutes = ['/','/store']

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const showHeader = showHeaderRoutes.includes(pathname)

  return (
    <>
      {showHeader && <Header />}
      {children}
      <Footer />
    </>
  )
}
