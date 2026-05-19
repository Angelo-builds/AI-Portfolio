import { useState, useEffect, FormEvent } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login, language } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Initial frontend-based check using window.location.hostname
    const hostname = window.location.hostname;
    console.log('[Admin Access] Frontend window.location.hostname is:', hostname);
    
    // Quick allow for LAN/Tailscale/Localhost hostnames directly
    const isLocalFrontend = 
      hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname.startsWith('192.168.') || 
      hostname.startsWith('10.') || 
      hostname.startsWith('100.') ||
      // In case of localhost tunneling or local domains
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal');

    if (isLocalFrontend) {
        console.log('[Admin Access] Allowed by frontend hostname check:', hostname);
        // We can safely allow the user to see the login screen
        return;
    }
    
    console.log('[Admin Access] Frontend hostname not recognized as local. Falling back to backend /api/admin-check validation...');

    // 2. Fallback to server check (e.g., if behind proxy but IP is passed via headers)
    fetch('/api/admin-check')
      .then(async res => {
        const contentType = res.headers.get('content-type');
        console.log('[Admin Access] Backend response status:', res.status, 'Content-Type:', contentType);
        
        if (!res.ok) {
           const text = await res.text();
           console.error('[Admin Access] Backend returned error status:', res.status, text.substring(0, 100));
           throw new Error(`HTTP ${res.status}: ${text.substring(0, 50)}...`);
        }
        
        if (contentType && contentType.includes('text/html')) {
           const text = await res.text();
           console.error('[Admin Access] Backend returned HTML instead of JSON. The Node server might not be running or the request was intercepted by Vite/Nginx.', text.substring(0, 200));
           throw new Error(`Received HTML instead of JSON. Are you running the raw Vite server instead of 'tsx server.ts'? (Check package.json dev script)`);
        }
        return res.json();
      })
      .then(data => {
        console.log('[Admin Access] Backend JSON Response:', data);
        if (!data.allowed) {
          console.warn('[Admin Access] Backend rejected access based on IP. Navigating to 404.');
          navigate('/404', { replace: true });
        } else {
          console.log('[Admin Access] Backend allowed access.');
        }
      })
      .catch((err) => {
        console.error('[Admin Access] Fatal error during backend check:', err);
        // Fallback: If the check fails entirely, probably safer to deny
        navigate('/404', { replace: true });
      });
  }, [navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate(`/${language}`);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          {language === 'en' ? 'Admin Access' : 'Accesso Admin'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {language === 'en' ? 'Restricted area' : 'Area riservata'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-slate-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-900 dark:text-white py-2 px-3 border"
                  placeholder={language === 'en' ? 'Enter password' : 'Inserisci password'}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {language === 'en' ? 'Incorrect password' : 'Password errata'}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {language === 'en' ? 'Login' : 'Accedi'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <button 
              onClick={() => navigate(`/${language}`)}
              className="w-full text-center text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              {language === 'en' ? 'Return to site' : 'Torna al sito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
