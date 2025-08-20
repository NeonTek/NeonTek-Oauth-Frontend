"use client";

import { useState, useEffect, FormEvent } from 'react';
import api from '@/lib/api';
import { Copy, Download, Check, Trash2 } from 'lucide-react';

interface ApiKey {
  _id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyName, setKeyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);


  const fetchKeys = async () => {
    try {
      setLoading(true);
      const response = await api.get('/keys');
      setKeys(response.data.keys);
    } catch (err) {
      setError('Failed to fetch API keys.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreateKey = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await api.post('/keys', { name: keyName });
      setNewKey(response.data.apiKey);
      setKeyName('');
      await fetchKeys();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create key.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (confirm('Are you sure you want to revoke this key? This action cannot be undone.')) {
        try {
            await api.delete(`/keys/${keyId}`);
            await fetchKeys(); // Refresh the list
        } catch (err) {
            alert('Failed to revoke key.');
        }
    }
  };
  
  const handleCopyKey = () => {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-6">
      <form onSubmit={handleCreateKey} className="flex items-center gap-4">
        <input
          type="text"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          placeholder="New key name"
          required
          className="flex-grow px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create New Key'}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Your Keys</h3>
        {loading ? (
            <p className="mt-2">Loading keys...</p>
        ) : keys.length === 0 ? (
            <p className="mt-2 text-gray-500">You have no active API keys.</p>
        ) : (
            <ul className="mt-4 space-y-3">
                {keys.map(key => (
                    <li key={key._id} className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
                        <div>
                            <p className="font-semibold dark:text-white">{key.name}</p>
                            <p className="text-sm font-mono text-gray-500">neonk_{key.keyPrefix}...</p>
                        </div>
                        <button onClick={() => handleRevokeKey(key._id)} className="p-2 text-red-500 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50">
                            <Trash2 className="w-5 h-5"/>
                        </button>
                    </li>
                ))}
            </ul>
        )}
      </div>

       {newKey && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Key Created</h2>
             <p className="mt-2 text-red-600 dark:text-red-400">
              Please save this key. You will not be able to see it again.
            </p>
             <div className="relative p-4 mt-4 font-mono text-sm bg-gray-100 rounded-md dark:bg-gray-900 dark:text-gray-300">
                <code>{newKey}</code>
                <button onClick={handleCopyKey} className="absolute p-1 text-gray-500 rounded-md top-2 right-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setNewKey(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}