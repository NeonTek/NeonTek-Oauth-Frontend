"use client";

import { useState } from 'react';

const CLIENT_ID = "34b52f49-b853-4052-890d-57a9f9b16331";
const REDIRECT_URI = "http://localhost:3000/callback";

export default function OauthTestPage() {

  const handleLogin = () => {
    const state = Math.random().toString(36).substring(2);
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      state: state,
    //   scope: 'openid profile email',
    });
    
    window.location.href = `http://localhost:5000/oauth/authorize?${params.toString()}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="p-8 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h1 className="text-2xl font-bold">Fake Third-Party App</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">This page simulates an external application.</p>
            <button
                onClick={handleLogin}
                className="px-6 py-3 mt-6 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
                Login with NeonTek
            </button>
        </div>
    </div>
  );
}