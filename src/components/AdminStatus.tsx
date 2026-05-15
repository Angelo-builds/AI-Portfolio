import { useState, useEffect } from 'react';
import { Database, Activity, ServerCrash, CheckCircle2, Settings2, X, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function AdminStatus() {
  const { language, content, setContent, isEditing } = useStore();
  const [status, setStatus] = useState<{ database: string; umami: string; error?: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/status')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setStatus(data))
      .catch(err => setStatus({ database: 'Error', umami: 'Error', error: err.message }));
  }, []);

  if (!status) return null;

  const dbOk = status.database === 'Connected';
  const umamiOk = status.umami === 'Reachable';

  const toggleSetting = (key: keyof NonNullable<typeof content.settings>) => {
    setContent({
      ...content,
      settings: {
        ...(content.settings || {}),
        [key]: !(content.settings && content.settings[key] !== false)
      }
    });
  };

  const renderToggle = (key: keyof NonNullable<typeof content.settings>, label: string) => {
    const isVisible = content.settings?.[key] !== false;
    return (
      <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 last:border-0">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <button
          onClick={() => toggleSetting(key)}
          disabled={!isEditing}
          className={`p-1.5 rounded-lg transition-colors ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800'} ${isVisible ? 'text-emerald-500' : 'text-slate-400'}`}
          title={isEditing ? "Toggle visibility" : "Enable Edit Mode to change"}
        >
          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-lg backdrop-blur-md text-xs sm:text-sm">
        <div className="flex justify-between items-center font-bold border-b pb-1 mb-1 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
          <span>{language === 'en' ? 'System Status' : 'Stato Sistema'}</span>
          <button onClick={() => setIsOpen(true)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-500" />
          <span className="font-medium">DB:</span>
          <span className={dbOk ? 'text-emerald-500 font-semibold flex items-center gap-1' : 'text-amber-500 font-semibold'}>
            {dbOk && <CheckCircle2 className="w-3 h-3" />}
            {status.database.substring(0, 20)}{status.database.length > 20 ? '...' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-fuchsia-500" />
          <span className="font-medium">Umami:</span>
          <span className={umamiOk ? 'text-emerald-500 font-semibold flex items-center gap-1' : 'text-rose-500 font-semibold flex items-center gap-1'}>
            {umamiOk ? <CheckCircle2 className="w-3 h-3" /> : <ServerCrash className="w-3 h-3" />}
            {status.umami.substring(0, 20)}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 max-w-md w-full relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Admin Dashboard</h2>
            
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Diagnostics</h3>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg text-xs font-mono space-y-2 border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <p><span className="text-blue-500">DB Status:</span> {status.database}</p>
                  <p><span className="text-fuchsia-500">Umami Status:</span> {status.umami}</p>
                  {status.error && <p className="text-red-500 break-words">Fetch Error: {status.error}</p>}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Section Visibility</h3>
                  {!isEditing && <span className="text-xs text-amber-500 font-medium">Enable Edit Mode to change</span>}
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3">
                  {renderToggle('showExperience', language === 'en' ? 'Experience' : 'Esperienza')}
                  {renderToggle('showEducation', language === 'en' ? 'Education' : 'Istruzione')}
                  {renderToggle('showSkills', language === 'en' ? 'Skills' : 'Competenze')}
                  {renderToggle('showProjects', language === 'en' ? 'Projects' : 'Progetti')}
                  {renderToggle('showCertifications', language === 'en' ? 'Certifications' : 'Certificazioni')}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
