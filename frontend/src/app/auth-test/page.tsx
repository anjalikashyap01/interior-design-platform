"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuthenticatedApi } from "@/lib/api/authenticated-client";

export default function AuthTestPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { request } = useAuthenticatedApi();

  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function testBackend() {
    try {
      setLoading(true);
      setResult("");

      const data = await request<{
        success: boolean;
        message: string;
        userId: string;
      }>("/clerk-auth/customer-test");

      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Please sign in first.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Clerk + Backend Test
          </h1>

          <p className="mt-2">
            Signed in as: {user.emailAddresses[0]?.emailAddress}
          </p>
        </div>

        <button
          onClick={testBackend}
          disabled={loading}
          className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Express Backend"}
        </button>

        {result && (
          <pre className="rounded-lg bg-gray-100 p-4 overflow-auto">
            {result}
          </pre>
        )}
      </div>
    </main>
  );
}