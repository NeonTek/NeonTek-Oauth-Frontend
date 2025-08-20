"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import RegisterClientForm from './RegisterClientForm';
import ApiKeyManager from './ApiKeyManager';

interface ClientApp {
  _id: string;
  name: string;
  clientId: string;
  redirectUris: string[];
  createdAt: string;
}

export default function DeveloperPage() {
  const [clients, setClients] = useState<ClientApp[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const response = await api.get('/clients');
      setClients(response.data.clients);
    } catch (err) {
      setError('Failed to fetch applications.');
      console.error(err);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="space-y-8">
      <div className="px-4 py-6 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
          Developer Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Register OAuth applications and manage your personal API keys.
        </p>
      </div>
      
      {/* New API Key Manager Section */}
      <div className="px-4 py-6 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
         <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">API Keys</h2>
         <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
           Use these keys for programmatic access to the API.
         </p>
         <ApiKeyManager />
      </div>


      {/* Existing OAuth Application Section */}
      <div className="px-4 py-6 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">OAuth Applications</h2>
        <RegisterClientForm onRegistrationSuccess={fetchClients} />
         <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Your Applications</h3>
            {loadingClients && <p className="mt-4">Loading applications...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {!loadingClients && clients.length === 0 ? (
              <p className="mt-4 text-gray-500">You have not registered any applications yet.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {clients.map((client) => (
                  <li key={client._id} className="p-4 border rounded-md dark:border-gray-700">
                    <h3 className="text-lg font-bold dark:text-white">{client.name}</h3>
                    <p className="text-sm font-mono text-gray-500 dark:text-gray-400">Client ID: {client.clientId}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Redirect URIs: {client.redirectUris.join(', ')}</p>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
    </div>
  );
}