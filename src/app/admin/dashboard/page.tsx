import { db } from '@/db';
import { projects } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { FolderKanban, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(projects);
  const totalProjects = Number(countResult[0]?.count || 0);

  return (
    <div className="space-y-8 w-full">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-xs text-slate-400 mt-1">Ringkasan status aplikasi dan isi portofolio kamu.</p>
        </div>

        <Link
          href="/admin/projects/create"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Proyek Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Proyek</p>
            <p className="text-2xl font-extrabold text-white mt-0.5">{totalProjects}</p>
          </div>
        </div>
      </div>
    </div>
  );
}