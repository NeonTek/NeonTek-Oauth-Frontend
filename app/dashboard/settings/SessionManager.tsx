"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Trash2, Trash, Monitor, Smartphone, Globe } from 'lucide-react';
import { UAParser } from 'ua-parser-js';

interface Session {
    id: string;
    createdAt: string;
    createdByIp: string;
    userAgent: string;
    isCurrent: boolean;
}

// Helper component to display a browser or OS icon
const DeviceIcon = ({ deviceType }: { deviceType: string | undefined }) => {
    if (deviceType === 'mobile') {
        return <Smartphone className="w-5 h-5 text-gray-500" />;
    }
    return <Monitor className="w-5 h-5 text-gray-500" />;
}

export default function SessionManager() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/sessions');
            setSessions(response.data.sessions);
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (sessionId: string) => {
        if (confirm('Are you sure you want to revoke this session?')) {
            try {
                await api.delete(`/auth/sessions/${sessionId}`);
                await fetchSessions();
            } catch (error) {
                alert('Failed to revoke session.');
            }
        }
    };
    
    const handleRevokeAll = async () => {
        if (confirm('Are you sure you want to revoke ALL other sessions?')) {
             try {
                await api.post(`/auth/sessions/revoke-all`);
                await fetchSessions();
            } catch (error) {
                alert('Failed to revoke all sessions.');
            }
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Active Sessions</h3>
                 <button onClick={handleRevokeAll} className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700">
                     <Trash className="w-4 h-4" />
                     Revoke All Other Sessions
                 </button>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">This is a list of devices that have logged into your account. Revoke any sessions you do not recognize.</p>
            
            {loading ? (
                <p className="mt-4">Loading sessions...</p>
            ) : (
                <ul className="mt-4 space-y-3">
                    {sessions.map(session => {
                        const parser = new UAParser(session.userAgent);
                        const result = parser.getResult();
                        const browserName = result.browser.name || 'Unknown Browser';
                        const osName = result.os.name || 'Unknown OS';
                        const deviceType = result.device.type;

                        return (
                            <li key={session.id} className={`flex items-center justify-between p-4 border rounded-md ${session.isCurrent ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/50 dark:border-blue-700' : 'dark:border-gray-700'}`}>
                                <div className="flex items-center gap-4">
                                    <DeviceIcon deviceType={deviceType} />
                                    <div>
                                        <p className="font-semibold dark:text-white">{browserName} on {osName}</p>
                                        <p className="text-sm text-gray-500">
                                            IP: {session.createdByIp}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Logged in: {new Date(session.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {session.isCurrent ? (
                                    <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">Current Session</span>
                                ) : (
                                    <button onClick={() => handleRevoke(session.id)} className="p-2 text-red-500 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50" title="Revoke Session">
                                        <Trash2 className="w-5 h-5"/>
                                    </button>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    );
}