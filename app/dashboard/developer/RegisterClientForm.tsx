"use client";

import { useState, FormEvent } from 'react';
import api from '@/lib/api';
import { Copy, Download, Check } from 'lucide-react';

interface NewClientCredentials {
  name: string;
  clientId: string;
  clientSecret: string;
}

interface RegisterClientFormProps {
  onRegistrationSuccess: () => void;
}

export default function RegisterClientForm({ onRegistrationSuccess }: RegisterClientFormProps) {
  const [name, setName] = useState('');
  const [redirectUris, setRedirectUris] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newClient, setNewClient] = useState<NewClientCredentials | null>(null);

  const [copiedField, setCopiedField] = useState<'id' | 'secret' | null>(null);

  const handleCopy = (text: string, field: 'id' | 'secret') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = () => {
    if (!newClient) return;
    const credentials = {
      name: newClient.name,
      clientId: newClient.clientId,
      clientSecret: newClient.clientSecret,
    };
    const jsonString = JSON.stringify(credentials, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${newClient.name.toLowerCase().replace(/\s+/g, '-')}-credentials.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const uris = redirectUris.split(',').map(uri => uri.trim()).filter(uri => uri);

    if (uris.length === 0) {
      setError('Please provide at least one valid Redirect URI.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post('/clients/register', { name, redirectUris: uris });
      setNewClient(response.data.client);
      setName('');
      setRedirectUris('');
      onRegistrationSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register application.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const closeModal = () => setNewClient(null);

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="appName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Application Name
          </label>
          <input
            type="text" id="appName" value={name} onChange={(e) => setName(e.target.value)} required
            className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="redirectUris" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Redirect URIs (comma-separated)
          </label>
          <input
            type="text" id="redirectUris" value={redirectUris} onChange={(e) => setRedirectUris(e.target.value)} required
            className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit" disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Registering...' : 'Register Application'}
        </button>
      </form>

      {newClient && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Application Registered!</h2>
            <p className="mt-2 text-red-600 dark:text-red-400">
              Please save your Client Secret. You will not be able to see it again.
            </p>
            <div className="p-4 mt-4 space-y-3 bg-gray-100 rounded-md dark:bg-gray-900">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Client ID</label>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{newClient.clientId}</span>
                  <button onClick={() => handleCopy(newClient.clientId, 'id')} className="p-1 text-gray-500 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                    {copiedField === 'id' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Client Secret</label>
                 <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{newClient.clientSecret}</span>
                  <button onClick={() => handleCopy(newClient.clientSecret, 'secret')} className="p-1 text-gray-500 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                    {copiedField === 'secret' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
               <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <Download className="w-4 h-4" />
                Download JSON
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}