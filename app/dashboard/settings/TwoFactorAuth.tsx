"use client";

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';

type SetupStage = 'not_enabled' | 'generating' | 'verifying' | 'enabled';

export default function TwoFactorAuth() {
  const { user } = useAuth();
  
  const [stage, setStage] = useState<SetupStage>(user?.twoFactorEnabled ? 'enabled' : 'not_enabled');
  
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setStage('generating');
    setError('');
    try {
      const response = await api.post('/2fa/generate');
      setQrCode(response.data.qrCodeUrl);
      setSecret(response.data.secret);
      setStage('verifying');
    } catch (err) {
      setError('Could not generate 2FA secret. Please try again.');
      setStage('not_enabled');
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/2fa/verify', { token });
      setStage('enabled');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid token. Please check your authenticator app.');
    }
  };

  const handleDisable = async () => {
    if (confirm('Are you sure you want to disable 2FA?')) {
      try {
        await api.post('/2fa/disable');
        setStage('not_enabled');
        setQrCode(null);
        setSecret(null);
      } catch (err) {
        setError('Failed to disable 2FA.');
      }
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Two-Factor Authentication (2FA)</h3>

      {stage === 'not_enabled' && (
        <>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Add an extra layer of security to your account by enabling 2FA.
          </p>
          <button onClick={handleGenerate} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Enable 2FA
          </button>
        </>
      )}

      {stage === 'verifying' && qrCode && (
        <div className="mt-4 max-w-lg">
          <p>1. Scan the QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
          <Image src={qrCode} alt="2FA QR Code" width={200} height={200} className="mt-2 mb-2" />
          <p>If you cannot scan the code, you can manually enter this secret:</p>
          <code className="block p-2 my-2 font-mono bg-gray-100 rounded dark:bg-gray-700">{secret}</code>
          <p className="mt-4">2. Enter the 6-digit code from your app to verify and complete the setup.</p>
          <form onSubmit={handleVerify} className="flex items-center gap-4 mt-2">
            <input 
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
              className="px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600"
            />
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
              Verify & Enable
            </button>
          </form>
        </div>
      )}

      {stage === 'enabled' && (
        <>
            <p className="mt-2 text-green-600">Two-Factor Authentication is currently enabled on your account.</p>
            <button onClick={handleDisable} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                Disable 2FA
            </button>
        </>
      )}
      
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}