"use client";
import { useState, useEffect } from "react";
import { STORAGE_KEYS } from "@/lib/storage";

export default function DebugStorage() {
  const [storageData, setStorageData] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const data = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      const fullKey = `gt_${key}`;
      const value = window.localStorage.getItem(fullKey);
      data[key] = value ? JSON.parse(value) : null;
    });
    setStorageData(data);
  }, []);

  if (!show) {
    return (
      <button 
        onClick={() => setShow(true)}
        className="fixed bottom-4 left-4 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-50 hover:opacity-100"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 border rounded-lg p-4 max-w-sm max-h-64 overflow-auto text-xs shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">LocalStorage Debug</h3>
        <button onClick={() => setShow(false)} className="text-gray-500 hover:text-gray-700">×</button>
      </div>
      <pre className="text-[10px] text-gray-600 dark:text-gray-400">
        {JSON.stringify(storageData, null, 2)}
      </pre>
    </div>
  );
}
