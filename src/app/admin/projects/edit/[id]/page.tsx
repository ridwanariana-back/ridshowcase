import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { updateProject } from '@/app/actions/admin';
import SubmitButton from '@/components/SubmitButton';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);

  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);

  if (!project) notFound();

  const handleUpdate = updateProject.bind(null, project.id, project.imageUrl);

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Proyek: {project.title}</h1>
          <p className="text-xs text-slate-400 mt-1">Perbarui informasi proyek ini.</p>
        </div>
        <Link href="/admin/projects" className="text-xs text-blue-400 hover:underline">
          &larr; Batal
        </Link>
      </div>

      <form action={handleUpdate} className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-6 text-slate-200 w-full">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Judul Proyek</label>
          <input name="title" defaultValue={project.title} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Deskripsi Singkat (EN)</label>
            <textarea name="shortDescEn" defaultValue={project.shortDescEn} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white h-24 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Deskripsi Singkat (ID)</label>
            <textarea name="shortDescId" defaultValue={project.shortDescId} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white h-24 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Deskripsi Panjang (EN)</label>
            <textarea name="longDescEn" defaultValue={project.longDescEn} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white h-32 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Deskripsi Panjang (ID)</label>
            <textarea name="longDescId" defaultValue={project.longDescId} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white h-32 focus:outline-none focus:border-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Tech Stack (Pisahkan Koma)</label>
          <input name="techStack" defaultValue={project.techStack.join(', ')} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Database</label>
            <input name="databaseUsed" defaultValue={project.databaseUsed} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Ganti Gambar (Opsional)</label>
            <input type="file" name="imageFile" accept="image/*" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Link Demo Website</label>
          <input name="demoUrl" defaultValue={project.demoUrl} required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500" />
        </div>

        <SubmitButton
          label="Update Proyek"
          loadingLabel="Mengupdate..."
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 text-sm mt-4 rounded-xl shadow-lg shadow-blue-950/30"
        />
      </form>
    </div>
  );
}