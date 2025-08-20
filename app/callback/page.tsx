// app/callback/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const CLIENT_ID = "34b52f49-b853-4052-890d-57a9f9b16331";
const CLIENT_SECRET = "d4463556-f3b6-4cc7-9da4-29447dc79482";
const REDIRECT_URI = "http://localhost:3000/callback";

function CallbackComponent() {
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const exchangeCodeForToken = async (code: string) => {
      try {
        const tokenResponse = await fetch('http://localhost:5000/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
          }),
        });

        const tokenData = await tokenResponse.json();
        if (!tokenResponse.ok) {
          throw new Error(tokenData.error_description || 'Failed to get access token.');
        }

        const { access_token } = tokenData;

        const userResponse = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        
        const userData = await userResponse.json();
        if (!userResponse.ok) {
            throw new Error(userData.message || 'Failed to fetch user data.');
        }

        setUserData(userData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const code = searchParams.get('code');
    const receivedState = searchParams.get('state');
    const storedState = sessionStorage.getItem('oauth_state');

    if (receivedState !== storedState) {
        setError("Invalid state parameter. CSRF attack detected!");
        setLoading(false);
        return;
    }
    
    if (code) {
      exchangeCodeForToken(code);
    } else {
      setError('No authorization code found.');
      setLoading(false);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {loading && <p>Exchanging code for token...</p>}
        {error && (
            <div className="text-red-500">
                <h2 className="text-xl font-bold">Error</h2>
                <p>{error}</p>
            </div>
        )}
        {userData && (
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-green-500">Login Successful!</h2>
                <p className="mt-4">Welcome, {userData.name || userData.email}!</p>
                <pre className="p-4 mt-4 text-sm bg-gray-100 rounded dark:bg-gray-900">
                    {JSON.stringify(userData, null, 2)}
                </pre>
            </div>
        )}
    </div>
  );
}

export default function OauthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackComponent />
        </Suspense>
    )
}