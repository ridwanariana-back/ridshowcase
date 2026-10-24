import { loginAdmin } from '@/app/actions/admin';
import SubmitButton from '@/components/SubmitButton';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4">
      <form
        action={loginAdmin}
        className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-sm w-full space-y-5 shadow-2xl"
      >
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-white">Admin Login</h1>
          <p className="text-xs text-slate-400">Masukkan password untuk mengelola ridshowcase</p>
        </div>

        {error && (
          <p className="text-red-400 text-xs text-center bg-red-950/40 p-2.5 rounded-lg border border-red-800/50">
            Password salah, silakan coba lagi.
          </p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password Rahasia"
          required
          className="w-full px-4 py-3 bg-slate-955 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition text-sm"
        />

        <SubmitButton
          label="Login ke Dashboard"
          loadingLabel="Memverifikasi..."
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-semibold"
        />
      </form>
    </div>
  );
}