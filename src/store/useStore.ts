import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialData, PortfolioData, Certification } from '../data/content';

export type Language = 'en' | 'it';
export type Theme = 'light' | 'dark';

const getSystemTheme = (): Theme => 
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

interface AppState {
  language: Language;
  theme: Theme;
  isAdmin: boolean;
  isEditing: boolean;
  isLoading: boolean;
  content: PortfolioData;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  login: (password: string) => boolean;
  logout: () => void;
  setIsEditing: (isEditing: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchContent: () => Promise<void>;
  updateContent: (newContent: PortfolioData) => Promise<void>;
  reorderCertifications: (certs: Certification[]) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'it',
      theme: getSystemTheme(),
      isAdmin: false,
      isEditing: false,
      isLoading: true, // Start loading
      content: initialData,

      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      login: (password) => {
        // Change this password to a secure one that you will remember!
        if (password === 'SuperSecurePassword!#123') {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdmin: false, isEditing: false }),
      setIsEditing: (isEditing) => set({ isEditing }),
      setIsLoading: (isLoading) => set({ isLoading }),
      
      fetchContent: async () => {
        try {
          const res = await fetch('/api/content');
          if (res.ok) {
            const data = await res.json();
            set({ content: data, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (err) {
          console.error('Fetch error:', err);
          set({ isLoading: false });
        }
      },

      updateContent: async (newContent) => {
        set({ content: newContent });
        try {
          await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContent)
          });
        } catch (err) {
          console.error('Save error:', err);
        }
      },

      reorderCertifications: async (certs) => {
        const newContent = { ...get().content, certifications: certs };
        set({ content: newContent });
        try {
          await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContent)
          });
        } catch (err) {
          console.error('Save error:', err);
        }
      },
    }),
    {
      name: 'portfolio-storage',
      partialize: (state) => ({ 
        language: state.language, 
        theme: state.theme, 
        isAdmin: state.isAdmin,
        isEditing: state.isEditing
        // Note: content is no longer in local storage, it comes from backend
      }),
    }
  )
);

