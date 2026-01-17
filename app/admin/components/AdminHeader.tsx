"use client";

import { useSession } from "next-auth/react";
import { Bell, User } from "lucide-react";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white">
            Welcome back, Admin
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage your portfolio content
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-slate-800 text-gray-400 hover:text-white transition">
            <Bell size={20} />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">
                {session?.user?.email?.split("@")[0] || "Admin"}
              </p>
              <p className="text-xs text-gray-400">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
