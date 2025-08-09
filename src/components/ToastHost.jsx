"use client";
import Toast from "@/components/Toast";
import { useApp } from "@/context/AppContext";

export default function ToastHost() {
  const { toast, setToast } = useApp();
  return <Toast toast={toast} onClose={() => setToast(null)} />;
}

