'use client'

import { Metadata } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

export const metadata: Metadata = {
  title: 'Sign Up | 0xFeather',
  description: 'Start a new journey with 0xFeather wallet.',
}

export default function SignUp() {

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormValues({ email: "", password: "" });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoading(false);
      if (!res.ok) {
        setError((await res.json()).message);
        return;
      }

      signIn(undefined, { callbackUrl: "/" });
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [formValues]);

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-between">
      <div className="bg-slate-900 w-full h-full">
        <div className="bg-gradient-to-b from-violet-600/[.15] via-transparent flex flex-col h-screen justify-center items-center">
          <div className="pt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700  w-[90%] md:w-[70%] lg:w-[50%]">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Register with us</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Already have an account yet?
                  <Link href="/auth/sign_in" className="text-blue-600 decoration-2 hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>

              <div className="mt-5">
                <form onSubmit={onSubmit}>
                  {error && (
                    <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
                  )}
                  <div className="grid gap-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Email address</label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formValues.email}
                          onChange={handleChange}
                          placeholder="Email address"
                          className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          required
                          aria-describedby="email-error" />
                        {
                          error && error === "User already exists" &&
                          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                            <svg className="h-5 w-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                            </svg>
                          </div>
                        }
                      </div>
                      <p className="hidden text-xs text-red-600 mt-2" id="email-error">Please include a valid email address so we can get back to you</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formValues.password}
                          onChange={handleChange}
                          placeholder="Password"
                          className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          required aria-describedby="password-error" />
                      </div>
                      <p className="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
                    </div>

                    <button
                      disabled={loading}
                      type="submit" className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">
                      {loading ?
                        <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
                          <span className="sr-only">Loading...</span>
                        </div>
                        : "Sign Up"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
