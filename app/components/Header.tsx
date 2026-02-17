"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/");
    router.refresh();
  }
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-md flex flex-row justify-between px-6">
      <div className="px-6 py-4">
        <h2 className="text-blue-400 font-extrabold text-3xl">
          Smart Bookmark
        </h2>
      </div>
      {user && (
        <button
          onClick={handleLogout}
          className="flex w-full max-w-3xl flex-col items-end justify-between py-4 cursor-pointer"
        >
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <p className="flex h-9 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-background transition-colors hover:bg-[#383838] md:w-[108px] hover:border-[#ccc] hover:border-2">
              Logout
            </p>
          </div>
        </button>
      )}
    </header>
  );
}
