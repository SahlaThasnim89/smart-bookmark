"use client";

import { createClient } from "@/lib/supabase-client";
import { useState } from "react";

export default function LoginButton() {
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    }
  };

  return (
    <div className="flex h-full flex-col align-middle items-center justify-center  text-md font-light tracking-wider">
      <p>Sign in to continue...</p>
      <button
        onClick={handleLogin}
        className="flex w-full max-w-3xl flex-col items-center justify-between py-2 cursor-pointer"
      >
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <p className="flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-background transition-colors hover:bg-[#383838] md:w-67.5 hover:border-[#ccc] hover:border-2">
            Sign in with Google
          </p>
        </div>
      </button>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </div>
  );
}
