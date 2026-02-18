"use client";

import { User } from "@supabase/supabase-js";
import Link from "next/link";

type Props = {
  user: User;
};

export default function Dashboard({ user }: Props) {
  return (
    <div className="p-16">
      <div className="flex flex-col justify-between items-center gap-2">
        <h1 className="text-4xl font-semibold">Manage Your Bookmarks</h1>

        <h2 className="text-xl pt-16">Welcome to Your Bookmark Hub</h2>
        <p className="text-sm tracking-wider text-blue-400">
          {user.email ?? "User"}
        </p>
        <p className="text-xl">
          Save important links and access them anytime.What would you like to
          do?
        </p>
      </div>
      <div className="flex justify-center gap-6 p-8">
        <Link href="/dashboard/showList" className="flex flex-col items-end">
          <button className="flex w-full max-w-3xl flex-col items-end justify-between py-4 cursor-pointer">
            <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
              <p className="flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-background transition-colors hover:bg-[#383838] md:w-49.5 hover:border-[#ccc] hover:border-2">
                View Bookmarks
              </p>
            </div>
          </button>
        </Link>

        <Link href="/dashboard/create" className="flex flex-col items-end">
          <button className="flex w-full max-w-3xl flex-col items-end justify-between py-4 cursor-pointer">
            <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
              <p className="flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-background transition-colors hover:bg-[#383838] md:w-49.5 hover:border-[#ccc] hover:border-2">
                Create New
              </p>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
}
