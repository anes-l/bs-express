import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toasts({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-[1000] space-y-3">
      {toasts.map(t => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const color = isSuccess ? 'text-green-600' : isError ? 'text-red-600' : 'text-[#002f45]';
        const bar = isSuccess ? 'from-green-500 to-green-600' : isError ? 'from-red-500 to-red-600' : 'from-[#002f45] to-[#002f45]';
        const Icon = isSuccess ? CheckCircle : isError ? AlertCircle : Info;
        return (
          <div key={t.id} className="relative pointer-events-auto flex items-start gap-3 rounded-2xl bg-white/95 backdrop-blur px-4 py-3 shadow-2xl ring-1 ring-black/5">
            <span className={`absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-gradient-to-b ${bar}`}></span>
            <Icon size={20} className={color} />
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{t.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}


