"use client";

import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "@/app/components/Avatar";
import ActivityFeed from "@/app/components/ActivityFeed";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="px-4 py-6 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
          Dashboard
        </h1>
        {user && (
          <div className="mt-6">
            <div className="flex items-center">
              <Avatar name={user.name || user.email} src={user.profilePicture} size={64} />
              <div className="ml-4">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Welcome back,{" "}
                  <span className="font-semibold">{user.name || user.email}!</span>
                </p>
                <p className="text-sm text-gray-500">
                  Last login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="px-4 py-6 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent Security Activity</h2>
        <div className="mt-4">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}