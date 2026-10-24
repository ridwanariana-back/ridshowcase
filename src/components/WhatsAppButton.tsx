'use client';

import { useTranslations } from 'next-intl';

interface WhatsAppButtonProps {
  phoneNumber: string;
  itemName: string;
  itemUrl: string;
  label: string;
}

export default function WhatsAppButton({
  phoneNumber,
  itemName,
  itemUrl,
  label,
}: WhatsAppButtonProps) {
  const t = useTranslations('WhatsApp');

  const handleContact = () => {
    // Mengambil pesan dinamis sesuai bahasa halaman yang aktif
    const textMessage = t('message', {
      title: itemName,
      url: itemUrl,
    });

    const encodedMessage = encodeURIComponent(textMessage);
    const waUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodedMessage}`;
    
    window.open(waUrl, '_blank');
  };

  return (
    <button
      onClick={handleContact}
      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center gap-2"
    >
      <span>{label}</span>
    </button>
  );
}