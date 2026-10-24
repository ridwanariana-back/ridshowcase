import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminIndexPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_session')?.value === 'authenticated';

  if (isAuthenticated) {
    redirect('/admin/dashboard');
  } else {
    redirect('/admin/login');
  }
}