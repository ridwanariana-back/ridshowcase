'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  className?: string;
}

export default function SubmitButton({ label, loadingLabel, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex items-center justify-center gap-2 font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? loadingLabel : label}
    </button>
  );
}