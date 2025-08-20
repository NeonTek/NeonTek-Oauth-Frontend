"use client";

import { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import PasswordSettings from './PasswordSettings';
import TwoFactorAuth from './TwoFactorAuth';
import SessionManager from './SessionManager';
import { User, Shield } from 'lucide-react';

type Tab = 'profile' | 'security';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const TabButton = ({ tabName, currentTab, setTab, icon: Icon, children }: any) => (
    <button
      onClick={() => setTab(tabName)}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg w-full text-left ${
        currentTab === tabName
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-white'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="truncate">{children}</span>
    </button>
  );

  return (
    <div className="px-4 py-6 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-900">
      <div className="md:flex">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4 md:pr-8">
          <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
            Account Settings
          </h2>
          <nav className="flex flex-col mt-6 space-y-2">
            <TabButton tabName="profile" currentTab={activeTab} setTab={setActiveTab} icon={User}>
              Profile
            </TabButton>
            <TabButton tabName="security" currentTab={activeTab} setTab={setActiveTab} icon={Shield}>
              Security
            </TabButton>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="mt-8 border-t pt-8 md:mt-0 md:w-3/4 md:pl-8 md:border-t-0 md:border-l md:pt-0 border-gray-200 dark:border-gray-700">
          {activeTab === 'profile' && (
            <ProfileSettings />
          )}
          
          {activeTab === 'security' && (
            <div className="space-y-12">
              <PasswordSettings />
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <TwoFactorAuth />
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <SessionManager />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}