import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import { Skeleton } from './components/Skeleton';

const Home = lazy(() => import('./pages/Home'));
const Experience = lazy(() => import('./pages/Experience'));
const Education = lazy(() => import('./pages/Education'));
const Skills = lazy(() => import('./pages/Skills'));
const Certifications = lazy(() => import('./pages/Certifications'));
const Projects = lazy(() => import('./pages/Projects'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex flex-col md:flex-row gap-12 items-center md:items-start pt-8 pb-16 opacity-50">
      <div className="w-48 xl:w-64 shrink-0 flex flex-col items-center">
        <Skeleton className="w-48 h-48 xl:w-64 xl:h-64 rounded-full" delay={0.1} />
      </div>
      <div className="flex-1 space-y-6 w-full">
        <div>
          <Skeleton className="h-12 w-3/4 max-w-sm mb-4" delay={0.2} />
          <Skeleton className="h-8 w-2/3 max-w-xs" delay={0.3} />
        </div>
        <div className="flex flex-wrap gap-4 pt-2">
          {['w-28', 'w-32', 'w-24', 'w-40', 'w-36'].map((w, i) => (
            <Skeleton key={i} className={`h-10 ${w} rounded-lg`} delay={0.4 + i * 0.05} />
          ))}
        </div>
        <div className="mt-8 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800/50">
          <Skeleton className="h-8 w-40 mb-6" delay={0.6} />
          <Skeleton className="h-4 w-full mb-3" delay={0.7} />
          <Skeleton className="h-4 w-11/12 mb-3" delay={0.8} />
          <Skeleton className="h-4 w-4/5 mb-3" delay={0.9} />
          <Skeleton className="h-4 w-full mb-3" delay={1.0} />
          <Skeleton className="h-4 w-3/4" delay={1.1} />
        </div>
      </div>
    </div>
  );
}

function FeatureGuard({ children, settingKey }: { children: React.ReactNode, settingKey: 'showExperience' | 'showEducation' | 'showCertifications' | 'showProjects' | 'showSkills' }) {
  const { content, isEditing } = useStore();
  if (!isEditing && content.settings?.[settingKey] === false) {
    return <Navigate to="/404" replace />;
  }
  return <>{children}</>;
}

function LanguageSync() {
  const { lang } = useParams<{lang: string}>();
  const { setLanguage } = useStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (lang === 'it' || lang === 'en') {
      setLanguage(lang);
    }
  }, [lang, setLanguage]);

  if (lang !== 'it' && lang !== 'en') {
    return <Navigate to="/404" replace />;
  }

  return <Layout />;
}

export default function App() {
  const { theme, language, fetchContent } = useStore();

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Optionally listen for system theme changes if we wanted, 
  // but since we no longer have "system" we only rely on the explicit light/dark state.

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to={`/${language || 'en'}`} replace />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/:lang" element={<LanguageSync />}>
            <Route index element={<Home />} />
            <Route path="experience" element={<FeatureGuard settingKey="showExperience"><Experience /></FeatureGuard>} />
            <Route path="education" element={<FeatureGuard settingKey="showEducation"><Education /></FeatureGuard>} />
            <Route path="skills" element={<FeatureGuard settingKey="showSkills"><Skills /></FeatureGuard>} />
            <Route path="projects" element={<FeatureGuard settingKey="showProjects"><Projects /></FeatureGuard>} />
            <Route path="certifications" element={<FeatureGuard settingKey="showCertifications"><Certifications /></FeatureGuard>} />
          </Route>

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
