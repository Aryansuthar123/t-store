'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Admin panel pages that should hide header/footer
  const isAdminRoute =
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/forgot-password') &&
    !pathname.startsWith('/admin/reset-password');

  // Auth routes (login/signup)
  const isAuthRoute =
    pathname.startsWith('/login') || pathname.startsWith('/signup');

  // Hide header/footer only for admin dashboard, login, signup
  const hideHeaderFooter = isAdminRoute || isAuthRoute;

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
