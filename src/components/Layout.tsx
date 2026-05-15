import { Link, useLocation, Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Moon, Sun, Menu, X, LogOut, Globe, Check, Edit2, Shield } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import AdminStatus from './AdminStatus';

export default function Layout() {
  const { language, setLanguage, theme, setTheme, isAdmin, logout, isEditing, setIsEditing, content } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleSaveDraft = () => {
    // Just a UI notification for successful draft save
    alert(language === 'en' ? 'Draft saved successfully!' : 'Bozza salvata con successo!');
  };

  const handlePublish = () => {
    // UI notification and exit edit mode
    alert(language === 'en' ? 'Changes published successfully!' : 'Modifiche pubblicate con successo!');
    setIsEditing(false);
  };

  const allNavLinks = [
    { name: { en: 'Home', it: 'Home' }, path: '', settingKey: null },
    { name: { en: 'Experience', it: 'Esperienza' }, path: '/experience', settingKey: 'showExperience' as const },
    { name: { en: 'Education', it: 'Istruzione' }, path: '/education', settingKey: 'showEducation' as const },
    { name: { en: 'Skills', it: 'Competenze' }, path: '/skills', settingKey: 'showSkills' as const },
    { name: { en: 'Projects', it: 'Progetti' }, path: '/projects', settingKey: 'showProjects' as const },
    { name: { en: 'Certifications', it: 'Certificazioni' }, path: '/certifications', settingKey: 'showCertifications' as const },
  ];

  const navLinks = allNavLinks.filter(link => {
    if (isEditing) return true; // Show all to admin while editing
    if (!link.settingKey) return true; // Always show Home
    return content.settings?.[link.settingKey] !== false; // Hide if explicitly false
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={`/${language}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              AB
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline-block">Angelo Brambilla</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => {
              const fullPath = `/${language}${link.path}`;
              const isActive = location.pathname === fullPath || (link.path !== '' && location.pathname.startsWith(fullPath));
              return (
                <Link
                  key={link.path}
                  to={fullPath}
                  className={cn(
                    "relative pb-1 transition-colors group",
                    isActive ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {link.name[language]}
                  <span className={cn(
                    "absolute left-0 bottom-0 w-full h-[2px] bg-blue-600 dark:bg-blue-400 transition-transform origin-left duration-300",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Lang Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">{language}</span>
            </button>

            {/* Theme Switch */}
            <div className="flex items-center">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={cn(
                  "p-2 rounded-lg transition-colors shadow-sm border cursor-pointer",
                  theme === 'light' 
                    ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100" 
                    : "bg-blue-900/30 border-blue-800/50 text-blue-400 hover:bg-blue-900/50"
                )}
                title="Toggle Theme"
              >
                {theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={logout}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                title="Logout Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <nav className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => {
              const fullPath = `/${language}${link.path}`;
              const isActive = location.pathname === fullPath || (link.path !== '' && location.pathname.startsWith(fullPath));
              return (
              <Link
                key={link.path}
                to={fullPath}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-lg font-medium inline-block relative py-1 self-start group",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {link.name[language]}
                <span className={cn(
                  "absolute left-0 bottom-0 w-full h-[2px] bg-blue-600 dark:bg-blue-400 transition-transform origin-left duration-300",
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )} />
              </Link>
            )})}
          </nav>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Outlet />
      </main>

  <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-12 bg-white/50 dark:bg-slate-950/50">
    <div className="container mx-auto px-4 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} Angelo Brambilla. {language === 'en' ? 'All rights reserved.' : 'Tutti i diritti riservati.'}
      </p>
      
      <a 
        href="/cv.pdf" 
        download
        className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" x2="12" y1="15" y2="3"/>
        </svg>
        <span>{language === 'en' ? 'Download CV' : 'Scarica CV'}</span>
      </a>
    </div>
  </footer>

      {/* Admin Floating Toolbar */}
      {isAdmin && (
        <>
          <AdminStatus />
          <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3">
            {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-5 py-3 rounded-full shadow-xl text-white font-bold transition-transform hover:scale-105 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700"
            >
              <Edit2 className="w-5 h-5 text-blue-400" /> 
              <span>{language === 'en' ? 'Edit Mode' : 'Modalità Modifica'}</span>
            </button>
          ) : (
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-2xl p-2 gap-2">
              <div className="px-4 py-2 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-slate-900 dark:text-white mr-2">Admin</span>
              </div>
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                {language === 'en' ? 'Save Draft' : 'Salva Bozza'}
              </button>
              <button
                onClick={handlePublish}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{language === 'en' ? 'Publish' : 'Pubblica'}</span>
              </button>
            </div>
          )}
        </div>
        </>
      )}
    </div>
  );
}
