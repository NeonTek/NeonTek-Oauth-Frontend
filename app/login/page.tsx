"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import api from "@/lib/api";
import { Mail, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const [isMagicLinkView, setIsMagicLinkView] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [magicLinkMessage, setMagicLinkMessage] = useState("");

  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, router]);


  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      await login(res.data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };
  
  const handleMagicLinkSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMagicLinkMessage("");
    try {
        await api.post("/auth/magic-login", { email: magicLinkEmail });
        setMagicLinkMessage("If an account with that email exists, a login link has been sent.");
    } catch (err: any) {
        setError("Could not send magic link. Please try again later.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-center">
          <Image src="/neontek-logo.png" alt="NeonTek logo" width={180} height={38} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          {isMagicLinkView ? "Sign in with a link" : "Login to your account"}
        </h2>
        
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        {magicLinkMessage && <p className="text-sm text-center text-green-500">{magicLinkMessage}</p>}


        {isMagicLinkView ? (
            // --- MAGIC LINK VIEW ---
            <form className="space-y-6" onSubmit={handleMagicLinkSubmit}>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Enter your email address and we will send you a link to sign in.
              </p>
              <div>
                <label htmlFor="magic-email" className="sr-only">Email address</label>
                <input
                  id="magic-email" name="email" type="email" required value={magicLinkEmail} onChange={(e) => setMagicLinkEmail(e.target.value)}
                  placeholder="Email address"
                  className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Send Magic Link
                </button>
              </div>
            </form>
        ) : (
            // --- DEFAULT PASSWORD VIEW ---
            <>
                <button onClick={handleGoogleSignIn} className="w-full flex justify-center items-center gap-2 py-2 px-4 border rounded-md text-sm font-medium bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    <Image src="/google.svg" alt="Google logo" width={18} height={18} />
                    Sign in with Google
                </button>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address"
                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                            Login
                        </button>
                    </div>
                </form>
            </>
        )}
        
        {/* Toggle between views */}
        <div className="text-sm text-center">
            <button onClick={() => setIsMagicLinkView(!isMagicLinkView)} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center gap-2 mx-auto">
              {isMagicLinkView ? <><KeyRound size={16}/> Sign in with password instead</> : <><Mail size={16}/> Sign in with a link instead</>}
            </button>
        </div>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}