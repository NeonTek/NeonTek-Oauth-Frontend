"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import api from '@/lib/api';
import Avatar from '@/app/components/Avatar';
import { Edit, X } from 'lucide-react';

export default function ProfileSettings() {
  // const { user, login } = useAuth();
  const { user, setUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', givenName: '', familyName: '', profilePicture: '',
    phoneNumber: '', gender: 'prefer_not_to_say', birthday: '',
    language: '', country: '', timezone: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputStyles = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white";


  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        givenName: user.givenName || '',
        familyName: user.familyName || '',
        profilePicture: user.profilePicture || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.gender || 'prefer_not_to_say',
        birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
        language: user.language || 'en',
        country: user.country || '',
        timezone: user.timezone || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');
    try {
      const updates = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== null && value !== '')
      );

      const response = await api.put('/auth/profile', updates);
      setUser(response.data);
      await api.put('/auth/profile', updates);
      // const token = localStorage.getItem('token');
      // if (token) {
      //   await login(token);
      // }
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const ProfileField = ({ label, value }: { label: string; value: string | undefined | null }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{value || 'Not set'}</dd>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h3>
        <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          {isEditing ? <><X size={16}/> Cancel</> : <><Edit size={16}/> Edit Profile</>}
        </button>
      </div>

      {isEditing ? (
        // --- EDIT MODE ---
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
           <div className="md:col-span-2 flex items-center space-x-4">
            <Avatar name={user?.name || user?.email} src={user?.profilePicture} size={80} />
            <div className="flex-grow">
                <label htmlFor="profilePicture" className="block text-sm font-medium">Profile Picture URL</label>
                <input type="text" name="profilePicture" id="profilePicture" value={formData.profilePicture} onChange={handleChange} placeholder="https://..." className={inputStyles} />
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Display Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputStyles} />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number</label>
            <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputStyles} />
          </div>
           <div>
            <label htmlFor="givenName" className="block text-sm font-medium">First Name</label>
            <input type="text" name="givenName" id="givenName" value={formData.givenName} onChange={handleChange} className={inputStyles} />
          </div>
           <div>
            <label htmlFor="familyName" className="block text-sm font-medium">Last Name</label>
            <input type="text" name="familyName" id="familyName" value={formData.familyName} onChange={handleChange} className={inputStyles} />
          </div>
           <div>
            <label htmlFor="birthday" className="block text-sm font-medium">Birthday</label>
            <input type="date" name="birthday" id="birthday" value={formData.birthday} onChange={handleChange} className={inputStyles} />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
            <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={inputStyles}>
              <option value="prefer_not_to_say">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
           <div>
            <label htmlFor="country" className="block text-sm font-medium">Country</label>
            <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} className={inputStyles} />
          </div>
           <div>
            <label htmlFor="language" className="block text-sm font-medium">Language</label>
            <input type="text" name="language" id="language" value={formData.language} onChange={handleChange} className={inputStyles} />
          </div>
          <div className="md:col-span-2">
              <label htmlFor="timezone" className="block text-sm font-medium">Timezone</label>
              <input type="text" name="timezone" id="timezone" value={formData.timezone} onChange={handleChange} className={inputStyles} />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            {message && <p className="inline-block ml-4 text-sm text-green-600">{message}</p>}
            {error && <p className="inline-block ml-4 text-sm text-red-600">{error}</p>}
          </div>
        </form>
      ) : (
        // --- VIEW MODE ---
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 pt-6">
                <ProfileField label="Display Name" value={user?.name} />
                <ProfileField label="Email Address" value={user?.email} />
                <ProfileField label="First Name" value={user?.givenName} />
                <ProfileField label="Last Name" value={user?.familyName} />
                <ProfileField label="Phone Number" value={user?.phoneNumber} />
                <ProfileField label="Birthday" value={user?.birthday ? new Date(user?.birthday).toLocaleDateString() : null} />
                <ProfileField label="Gender" value={user?.gender} />
                <ProfileField label="Country" value={user?.country} />
                <ProfileField label="Language" value={user?.language} />
                <ProfileField label="Timezone" value={user?.timezone} />
            </dl>
        </div>
      )}
    </div>
  );
}