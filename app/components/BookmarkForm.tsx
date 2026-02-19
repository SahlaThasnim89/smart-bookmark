"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddBookmarkForm({ onAdded }: { onAdded?: () => void }) {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function isValidUrl(value: string) {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (trimmedTitle.length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }

    if (trimmedTitle.length > 100) {
      setError("Title cannot exceed 100 characters.");
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError("Please enter a valid URL starting with http or https.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (!user) {
      console.error("User not logged in");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("bookmarks")
      .insert([
        {
          title,
          url,
          user_id: user.id,
        },
      ])
      .select();

    setLoading(false);

    if (!error) {
      router.push("/dashboard/showList");
      router.refresh();
    } else {
      setError("Failed to save bookmark. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center p-12">
      <div className="w-full max-w-xl rounded-xl border p-6 shadow-sm border-slate-200 bg-white">
        <h2 className="mb-4 text-xl font-semibold">Add New Bookmark</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-lg px-4 bg-slate-50 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="rounded-lg px-4 bg-slate-50 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Bookmark"}
          </button>
        </form>
      </div>
      <div>
        <div className="flex flex-row gap-8 items-start">
          <Link href="/dashboard" className="flex flex-col items-start">
            <button className="flex w-full max-w-3xl flex-col items-end justify-between py-2 cursor-pointer">
              <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
                <p className="flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-background transition-colors hover:bg-[#383838] md:w-67.5 hover:border-[#ccc] hover:border-2">
                  Go to home page
                </p>
              </div>
            </button>
          </Link>
          <Link href="/dashboard/showList" className="flex flex-col items-end">
            <button className="flex w-full max-w-3xl flex-col items-end justify-between py-2 cursor-pointer">
              <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
                <p className="flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-background transition-colors hover:bg-[#383838] md:w-67.5 hover:border-[#ccc] hover:border-2">
                  View Bookmarks
                </p>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
