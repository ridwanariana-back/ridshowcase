import { db } from '@/db';
import { projects } from '@/db/schema';
import { ilike, or, sql } from 'drizzle-orm';
import Link from 'next/link';
import { Plus, Edit3, Search } from 'lucide-react';
import DeleteProjectButton from '@/components/DeleteProjectButton';

export default async function AdminProjectsListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const query = q || '';
  const currentPage = Number(page) || 1;
  const itemsPerPage = 10; // Pagination 10 item per halaman
  const offset = (currentPage - 1) * itemsPerPage;

  const whereCondition = query
    ? or(
        ilike(projects.title, `%${query}%`),
        ilike(projects.databaseUsed, `%${query}%`)
      )
    : undefined;

  const [dataList, countResult] = await Promise.all([
    db.select().from(projects).where(whereCondition).limit(itemsPerPage).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(projects).where(whereCondition),
  ]);

  const totalItems = Number(countResult[0]?.count || 0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Proyek</h1>
          <p className="text-xs text-slate-400 mt-1">Daftar proyek yang sedang tampil di halaman utama.</p>
        </div>

        <Link
          href="/admin/projects/create"
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Proyek
        </Link>
      </div>

      {/* Admin Search Bar */}
      <form method="GET" className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Cari berdasarkan judul atau database..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white rounded-xl transition">
          Cari
        </button>
      </form>

      {/* Tabel Item Proyek */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Gambar</th>
              <th className="p-4">Judul</th>
              <th className="p-4">Tech Stack</th>
              <th className="p-4">Database</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {dataList.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition">
                <td className="p-4">
                  <img src={p.imageUrl} alt={p.title} className="w-12 h-10 object-cover rounded-lg border border-slate-800" />
                </td>
                <td className="p-4 font-bold text-white">{p.title}</td>
                <td className="p-4">{p.techStack.join(', ')}</td>
                <td className="p-4">{p.databaseUsed}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/admin/projects/edit/${p.id}`}
                      className="p-2 bg-blue-500/10 hover:bg-blue-600 border border-blue-500/20 text-blue-400 hover:text-white rounded-lg transition"
                      title="Edit Proyek"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <DeleteProjectButton id={p.id} title={p.title} />
                  </div>
                </td>
              </tr>
            ))}
            {dataList.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-8 text-slate-500">
                  Tidak ada proyek ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (10 Item) */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
          <span>Menampilkan {dataList.length} dari {totalItems} proyek</span>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/projects?q=${query}&page=${currentPage - 1}`}
                className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 text-white"
              >
                &larr; Prev
              </Link>
            )}
            <span className="px-3 py-2 bg-slate-950 border border-slate-800/80 rounded-lg text-slate-300">
              Halaman {currentPage} / {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link
                href={`/admin/projects?q=${query}&page=${currentPage + 1}`}
                className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 text-white"
              >
                Next &rarr;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}