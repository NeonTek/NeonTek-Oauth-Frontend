"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { ShieldCheck, LogIn, KeyRound, Lock } from 'lucide-react';

interface ActivityEvent {
  _id: string;
  action: string;
  createdAt: string;
  ip: string;
  userAgent: string;
}

// A helper function to map event types to icons and text
const getActivityDetails = (action: string) => {
  switch (action) {
    case 'login':
      return { Icon: LogIn, text: 'Successful Login' };
    case 'change_password':
      return { Icon: Lock, text: 'Password Changed' };
    case 'enable_2fa':
      return { Icon: ShieldCheck, text: '2FA Enabled' };
    case 'disable_2fa':
        return { Icon: ShieldCheck, text: '2FA Disabled' };
    case 'create_api_key':
        return { Icon: KeyRound, text: 'API Key Created' };
    default:
      return { Icon: ShieldCheck, text: action.replace(/_/g, ' ') };
  }
};

export default function ActivityFeed() {
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await api.get('/auth/activity');
        setActivity(response.data.activity);
      } catch (error) {
        console.error("Failed to fetch activity", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  if (loading) {
    return <p>Loading activity...</p>;
  }

  if (activity.length === 0) {
    return <p className="text-gray-500">No recent security activity found.</p>;
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {activity.map((event, eventIdx) => {
          const { Icon, text } = getActivityDetails(event.action);
          return (
            <li key={event._id}>
              <div className="relative pb-8">
                {eventIdx !== activity.length - 1 ? (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                ) : null}
                <div className="relative flex items-center space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                      <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {text}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        From IP: {event.ip}
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={event.createdAt}>{new Date(event.createdAt).toLocaleString()}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  );
}