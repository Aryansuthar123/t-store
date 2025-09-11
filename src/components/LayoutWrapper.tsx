'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

const hideHeaderRoutes = ['/signup', '/login']

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideHeader = hideHeaderRoutes.includes(pathname)

  
  return (
    <>
      {!hideHeader && <Header />}
      {children}
      <Footer />
    </>
  )
}
