"use client";
import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const color = toast.type === 'error' ? 'bg-red-500' : toast.type === 'success' ? 'bg-green-600' : 'bg-slate-700';

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
      <div className={`pointer-events-auto ${color} text-white px-4 py-2 rounded shadow-lg card-hover`}>{toast.message}</div>
    </div>
  );
}

