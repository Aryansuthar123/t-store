"use client";

import Sidebar from "../admin/components/Sidebar";

export default function Layout({ children }) {
  return (
    <main className="flex">
      <Sidebar />
      <section className="flex-1">{children}</section>
    </main>
  );
}
