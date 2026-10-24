import { addProject } from '@/app/actions/admin';
import SubmitButton from '@/components/SubmitButton';
import Link from 'next/link';

export default function CreateProjectPage() {
  return (
    <div className="space-y-6 w-full">
      {/* Header Form */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Tambah Proyek Baru</h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload gambar dan isi detail proyek untuk dipajang.
          </p>
        </div>
        <Link href="/admin/projects" className="text-xs text-blue-400 hover:underline">
          &larr; Batal
        </Link>
      </div>

      {/* Form Card Mengisi Seluruh Area Kanan */}
      <form
        action={addProject}
        className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-6 text-slate-200 w-full"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
            Judul Proyek
          </label>
          <input
            name="title"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
              Deskripsi Singkat (EN)
            </label>
            <textarea
              name="shortDescEn"
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white h-24 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
              Deskripsi Singkat (ID)
            </label>
            <textarea
              name="shortDescId"
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white h-24 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
              Deskripsi Panjang (EN)
            </label>
            <textarea
              name="longDescEn"
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white h-32 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
              Deskripsi Panjang (ID)
            </label>
            <textarea
              name="longDescId"
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white h-32 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
            Tech Stack (Pisahkan Koma)
          </label>
          <input
            name="techStack"
            placeholder="Next.js, Tailwind CSS, TypeScript"
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
              Database
            </label>
            <input
              name="databaseUsed"
              placeholder="PostgreSQL (Neon)"
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
              Upload Gambar Preview
            </label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              required
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
            Link Demo Website
          </label>
          <input
            name="demoUrl"
            placeholder="https://..."
            required
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <SubmitButton
          label="Upload & Simpan Proyek"
          loadingLabel="Mengupload & Menyimpan..."
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 text-sm mt-4 rounded-xl shadow-lg shadow-emerald-950/30"
        />
      </form>
    </div>
  );
}