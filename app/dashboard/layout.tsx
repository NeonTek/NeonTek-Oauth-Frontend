"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading session...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white shadow-sm dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <Image
                  src="/neontek-logo.png"
                  alt="NeonTek logo"
                  width={140}
                  height={30}
                />
              </div>
              <div className="hidden md:flex md:space-x-8">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                  Dashboard
                </Link>
                <Link href="/dashboard/developer" className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                  Developer
                </Link>
                <Link href="/dashboard/settings" className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                  Settings
                </Link>

                {user && user.roles.includes('admin') && (
                  <Link href="/dashboard/admin" className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300">
                    Admin
                  </Link>)}
              </div>
            </div>
            <div className="flex items-center">
              <span className="hidden sm:inline-block mr-4 text-gray-700 dark:text-gray-300">{user?.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}