'use client';

import { deleteProject } from '@/app/actions/admin';
import { Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function DeleteProjectButton({ id, title }: { id: number; title: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Apakah kamu yakin ingin menghapus proyek "${title}"?`)) {
      setLoading(true);
      await deleteProject(id);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 bg-red-500/10 hover:bg-red-600 border border-red-500/20 text-red-400 hover:text-white rounded-lg transition disabled:opacity-50"
      title="Hapus Proyek"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}