"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
  User,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    name: "About Me",
    href: "/admin/about",
    icon: User,
  },
  {
    name: "Contacts",
    href: "/admin/contacts",
    icon: Mail,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-purple-500/20
          transform transition-transform duration-300 ease-in-out z-40
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-purple-500/20">
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-gray-400 mt-1">Portfolio Manager</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "text-gray-400 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-purple-500/20">
            <button
              onClick={() =>
                signOut({ callbackUrl: "/admin/login", redirect: true })
              }
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
}
