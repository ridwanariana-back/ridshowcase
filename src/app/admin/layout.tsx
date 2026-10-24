import '@/app/globals.css';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { logoutAdmin } from '@/app/actions/admin';
import SubmitButton from '@/components/SubmitButton';
import { LayoutDashboard, FolderKanban, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

// --- METADATA ADMIN LAYOUT ---
export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard | ridshowcase',
    template: '%s | Admin ridshowcase',
  },
  description: 'Admin Panel for managing portfolio projects in ridshowcase.',
  // Mencegah mesin pencari (Google, Bing, dll) mengindeks halaman Admin
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('admin_session')?.value === 'authenticated';

  return (
    <html lang="en" className="dark h-full">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased flex flex-col md:flex-row">
        {isAuthenticated ? (
          <div className="flex w-full min-h-screen bg-slate-950">
            {/* Sidebar Kiri */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0">
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">ADMIN</span>
                  <h1 className="font-extrabold text-white text-lg tracking-tight">ridshowcase</h1>
                </div>

                <nav className="space-y-1">
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    Dashboard
                  </Link>

                  <Link
                    href="/admin/projects"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
                  >
                    <FolderKanban className="w-4 h-4 text-emerald-400" />
                    Kelola Proyek
                  </Link>
                </nav>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-800/80">
                <Link
                  href="/en"
                  target="_blank"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition"
                >
                  Lihat Web Utama
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <form action={logoutAdmin}>
                  <SubmitButton
                    label="Logout"
                    loadingLabel="Logging out..."
                    className="w-full bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 text-xs py-2 rounded-xl"
                  />
                </form>
              </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 p-8 overflow-y-auto bg-slate-950 text-slate-100 min-w-0">
              {children}
            </main>
          </div>
        ) : (
          <div className="w-full bg-slate-950 min-h-screen">{children}</div>
        )}
      </body>
    </html>
  );
}