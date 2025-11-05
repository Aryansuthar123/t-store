'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();


  const cleanPath = pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;


  const hideHeaderFooterRoutes = [
    '/login',
    '/signup',
    '/verify-otp',
    '/forgot-password',
    '/reset-password',
    '/admin-login',           
    '/admin/forgot-password',
    '/admin/reset-password',
  ];

  const hideHeaderFooter = hideHeaderFooterRoutes.some(
    (route) => cleanPath === route || cleanPath.startsWith(route)
  );

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
