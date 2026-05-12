import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, Globe } from 'lucide-react';

export default function NotFound() {
  const { language, setLanguage } = useStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Lang Switch */}
      <div className="absolute top-8 right-8">
        <button
          onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          title="Toggle Language"
        >
          <Globe className="w-5 h-5 text-slate-500" />
          <span className="text-sm font-bold uppercase text-slate-700 dark:text-slate-300">{language}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-lg text-center border border-slate-200 dark:border-slate-700 animate-slide-up">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Compass className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-red-100 dark:bg-red-900/30 font-bold text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm border-2 border-white dark:border-slate-800">
              404
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          {language === 'en' ? 'Lost in space!' : 'Perso nello spazio!'}
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
          {language === 'en' 
            ? "The page you're looking for doesn't exist or has been moved." 
            : "La pagina che stai cercando non esiste o è stata spostata."}
        </p>
        
        <button
          onClick={() => navigate(`/${language}`)}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          <Home className="w-5 h-5" />
          <span>{language === 'en' ? 'Back to Home' : 'Torna alla Home'}</span>
        </button>
      </div>
    </div>
  );
}
