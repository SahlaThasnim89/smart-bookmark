# Smart Bookmark App

A simple bookmark manager built with **Next.js**, **Supabase**, and **Tailwind CSS**.  
Users can log in via **Google OAuth**, add bookmarks, view them in real-time, and delete them. Bookmarks are private per user.

---

## Features

- **Google OAuth Login** – Sign up and log in using Google only (no email/password required)
- **Add Bookmarks** – Save a URL with a title
- **Private Bookmarks** – Each user's bookmarks are private
- **Realtime Updates** – If multiple tabs are open, bookmarks added/deleted are synced instantly
- **Delete Bookmarks** – Users can delete their own bookmarks
- **Pagination** – Bookmark list is paginated for easier navigation
- **Deployed** – Live app hosted on [Vercel](https://smart-bookmark-seven-eta.vercel.app/)

---

## Tech Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS  
- **Backend / Database:** Supabase (Auth, Database, Realtime)  
- **Deployment:** Vercel  

---

## Setup Instructions

1. **Clone the repo**
```bash
git clone https://github.com/SahlaThasnim89/smart-bookmark.git
cd smart-bookmark
```

2. **Install dependencies**
```bash
npm install
```



3. **Setup environment variables**
Create a .env.local file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**
```
npm run dev
```

Open the app
Visit http://localhost:3000 in your browser.

## Usage

- Login via Google OAuth
- Add a bookmark: Enter a title and URL in the form
- View bookmarks: Paginated table shows your bookmarks
- Realtime: Open a second tab and add/delete bookmarks to see them update instantly
- Delete bookmarks: Click "Delete" on any bookmark to remove it

## Realtime Implementation

- Subscribed to Supabase's bookmarks table using Realtime channels
- Only bookmarks belonging to the logged-in user (user_id) are subscribed
- On any INSERT, UPDATE, or DELETE, the table refreshes the current page of bookmarks

## Pagination

- Displays 6 bookmarks per page
- Works with realtime updates
- "Prev" / "Next" buttons and page numbers allow navigation

## Deployment

- Deployed on Vercel: https://smart-bookmark-seven-eta.vercel.app/
- Make sure your Supabase project allows requests from the deployed domain

## Challenges & How I Solved Them


**1. Realtime Subscription Causing Duplicate Fetches**

Problem:
Initially, I placed the pagination state (page) inside the dependency array of the realtime subscription useEffect. This caused:

- Multiple channel re-subscriptions
- Duplicate realtime events
- Unnecessary refetches
- Performance inefficiency

Root Cause:
Every time the page changed, React re-ran the effect and re-created the Supabase realtime subscription.

Solution:
I separated concerns:

- One useEffect handles pagination-based data fetching
- A separate useEffect handles realtime subscription
- The realtime subscription no longer depends on pagination state. Instead, on receiving INSERT, UPDATE, or DELETE, it triggers a controlled refetch of the current page.
- This eliminated duplicate subscriptions and stabilized updates.


**2. Realtime + Pagination Edge Case**

Problem:
When a bookmark was deleted on the last page, sometimes the UI would show an empty page even though previous pages contained data.

Root Cause:
Pagination state was not recalculated after deletion.

Solution:
- After each realtime event or delete action:
- Recalculate total bookmark count
- Adjust current page if it exceeds the available page range
- Then refetch data
- This ensures pagination always remains valid.


**3. Row Level Security (RLS) Blocking Queries**

Problem:
Initially, fetch and insert operations failed silently.

Root Cause:
RLS was enabled, but policies were not correctly configured.

Solution:
Implemented proper policies:

- SELECT using (auth.uid() = user_id)
- INSERT with WITH CHECK (auth.uid() = user_id)
- DELETE using (auth.uid() = user_id)

After correctly setting policies, user data became fully isolated and secure.


**4. Google OAuth Redirect Issues in Production**

Problem:
Google login worked locally but failed after deploying to Vercel.

Root Cause:
The deployed domain was not added to the allowed redirect URLs in Supabase authentication settings.

Solution:
Added:
- Vercel production URL
- Localhost development URL

To Supabase → Authentication → URL Configuration.


**5. Validating URLs on the Frontend**

Problem:
Users could enter invalid strings that were not proper URLs.

Solution:
Implemented client-side validation using:
```
try {
  new URL(url)
} catch {
  setError("Invalid URL format")
}
```

This prevents malformed URLs from being inserted.

**6.Validation**

URL and title fields are validated on the frontend:
Title must not be empty
URL must be a valid URL format

## Database Schema

Table: **bookmarks**
```
Column	Type	Description
id	uuid	Primary key
user_id	uuid	References auth.users
title	text	Bookmark title
url	text	Bookmark URL
created_at	timestamp	Auto-generated
```

## Row Level Security Policies

**Enable RLS**
```
alter table bookmarks enable row level security;
```
**Select Policy**
```
create policy "Users can view their own bookmarks"
on bookmarks
for select
using (auth.uid() = user_id);
```

**Insert Policy**
```
create policy "Users can insert their own bookmarks"
on bookmarks
for insert
with check (auth.uid() = user_id);
```

**Delete Policy**
```
create policy "Users can delete their own bookmarks"
on bookmarks
for delete
using (auth.uid() = user_id);
```

## Testing Instructions

- Login using Google
- Add a bookmark
- Open another tab
- Confirm realtime update
- Logout and login with different account
- Confirm bookmarks are private

## Deployment Steps

- Push to GitHub
- Import project in Vercel
- Add environment variables
- Deploy
- Enable Google OAuth redirect URL in Supabase

## Requirement Coverage

This project satisfies all assignment requirements:

- Google OAuth authentication only
- User-specific private bookmarks (RLS enforced)
- Add and delete functionality
- Real-time updates across tabs
- Deployed on Vercel with public GitHub repository
- Includes explanation of implementation challenges



