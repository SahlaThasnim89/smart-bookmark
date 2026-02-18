"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import Link from "next/link";
import Pagination from "./Pagination";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  created_at: string;
}

export default function BookmarksTable() {
  const supabase = createClient();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 6;

  const [userId, setUserId] = useState<string | null>(null);

  async function fetchBookmarks() {
    setLoading(true);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    const { data, error,count  } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, end);

    if (!error && data) {
      setBookmarks(data);
      setTotalCount(count || 0);
    }

    setLoading(false);
  }

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
  if (!userId) return;
  fetchBookmarks();
}, [userId, currentPage]);

  useEffect(() => {
    if (!userId) return;


    const channel = supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchBookmarks();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function handleDelete(id: string) {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <p>Loading bookmarks...</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);


  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="flex text-center align-center justfy-center">
          <h2 className="text-2xl font-semibold text-center">
            Saved Bookmarks
          </h2>
        </div>
        <div className="flex flex-row gap-2">
          <Link href="/dashboard/create" className="flex flex-col items-end">
            <button className="flex w-full max-w-3xl flex-col items-end justify-between py-4 cursor-pointer">
              <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
                <p className="flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-background transition-colors hover:bg-[#383838] md:w-49.5 hover:border-[#ccc] hover:border-2">
                  Create New
                </p>
              </div>
            </button>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-end">
            <button className="flex w-full max-w-3xl flex-col items-end justify-between py-4 cursor-pointer">
              <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
                <p className="flex h-12 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-background transition-colors hover:bg-[#383838] md:w-49.5 hover:border-[#ccc] hover:border-2">
                  Go to home page
                </p>
              </div>
            </button>
          </Link>
        </div>
      </div>
      <div className="w-full overflow-x-auto rounded-xl border shadow-sm border-slate-200">
        <table className="w-full border-collapse shadow-md border-slate-200 text-left bg-white">
          <thead className="bg-slate-200">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookmarks.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No bookmarks saved yet.
                </td>
              </tr>
            ) : (
              bookmarks.map((bookmark) => (
                <tr
                  key={bookmark.id}
                  className="odd:bg-white even:bg-slate-50 hover:bg-slate-100 transition"
                >
                  <td className="px-4 py-3 font-medium">{bookmark.title}</td>
                  <td className="px-4 py-3">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Visit
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      className="text-white bg-red-500 h-8 w-20 rounded-sm hover:cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-end w-full">
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      </div>
    </div>
  );
}
