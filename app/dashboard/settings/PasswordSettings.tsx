"use client";

import { useState, FormEvent } from 'react';
import api from '@/lib/api';

export default function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    if (newPassword.length < 8) {
        setError("New password must be at least 8 characters long.");
        setIsSubmitting(false);
        return;
    }

    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setMessage('Password changed successfully. You have been logged out.');
    //   Todo: Redirect to login
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-w-lg">
        <div>
          <label htmlFor="currentPassword"  className="block text-sm font-medium">Current Password</label>
          <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <div>
          <label htmlFor="newPassword"  className="block text-sm font-medium">New Password</label>
          <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
        </div>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
          {isSubmitting ? 'Changing...' : 'Change Password'}
        </button>
        {message && <p className="text-sm text-green-600">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}