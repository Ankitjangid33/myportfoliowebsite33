"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin";

  return (
    <SessionProvider>
      {isLoginPage ? (
        children
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <AdminSidebar />
          <div className="lg:ml-64">
            <AdminHeader />
            <main className="p-6">{children}</main>
          </div>
        </div>
      )}
    </SessionProvider>
  );
}
