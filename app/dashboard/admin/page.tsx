"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import Avatar from '@/app/components/Avatar';

interface SystemUser {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
  emailVerified: boolean;
}

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && !currentUser.roles.includes('admin')) {
      router.push('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data.users);
      } catch (err: any) {
        setError(err.response?.data?.message || 'You do not have permission to view this page.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
        fetchUsers();
    }
  }, [currentUser, router]);

  if (error) {
    return (
        <div className="px-4 py-6 text-center text-red-500 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="mt-2">{error}</p>
        </div>
    );
  }

  return (
    <div className="px-4 py-6 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
      <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">User Management</p>

      {loading ? (
        <p className="mt-4">Loading users...</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Roles</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar name={user.name || user.email} src={null} size={40} />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {user.roles.map(role => (
                        <span key={role} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mr-1">
                            {role}
                        </span>
                    ))}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    {user.emailVerified ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Verified</span>
                    ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Unverified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}