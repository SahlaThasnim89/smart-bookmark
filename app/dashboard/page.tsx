import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Dashboard from './Dashboard'



export default async function page() {
       const supabase =await createClient()
    
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  return <Dashboard user={user} />

}

