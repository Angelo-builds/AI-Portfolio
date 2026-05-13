import { useState, useEffect } from 'react';
import { Database, Activity, ServerCrash, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function AdminStatus() {
  const { language } = useStore();
  const [status, setStatus] = useState<{ database: string; umami: string } | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => setStatus({ database: 'Error fetching', umami: 'Error fetching' }));
  }, []);

  if (!status) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg backdrop-blur-md text-xs sm:text-sm">
      <div className="flex justify-between font-bold border-b pb-1 mb-1 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
        <span>{language === 'en' ? 'System Status' : 'Stato di Sistema'}</span>
      </div>
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-blue-500" />
        <span className="font-medium">DB:</span>
        <span className={status.database === 'Connected' ? 'text-emerald-500 font-semibold flex items-center gap-1' : 'text-amber-500 font-semibold'}>
          {status.database === 'Connected' && <CheckCircle2 className="w-3 h-3" />}
          {status.database}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-fuchsia-500" />
        <span className="font-medium">Umami:</span>
        <span className={status.umami === 'Reachable' ? 'text-emerald-500 font-semibold flex items-center gap-1' : 'text-rose-500 font-semibold flex items-center gap-1'}>
          {status.umami === 'Reachable' ? <CheckCircle2 className="w-3 h-3" /> : <ServerCrash className="w-3 h-3" />}
          {status.umami}
        </span>
      </div>
    </div>
  );
}
