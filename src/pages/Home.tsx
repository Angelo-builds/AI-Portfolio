import { useStore } from '../store/useStore';
import { Mail, Phone, Github, Linkedin, Download, Edit2, Check, User } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Skeleton } from '../components/Skeleton';

export default function Home() {
  const { language, content, isAdmin, isEditing, isLoading, updateContent } = useStore();
  const { profile, summary } = content;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col md:flex-row gap-12 items-center md:items-start pt-8 pb-16"
    >
      
      {/* Profile Photo Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-48 xl:w-64 shrink-0 flex flex-col items-center"
      >
        <div className="relative w-48 h-48 xl:w-64 xl:h-64 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl shadow-blue-900/10 dark:shadow-blue-900/20">
          <img 
            src={profile.photoUrl} 
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white p-2 text-center text-xs">
              <span className="mb-2">Image URL:</span>
              <input 
                className="w-full bg-white/20 px-2 py-1 rounded border border-white/30 text-white outline-none focus:border-blue-400"
                value={profile.photoUrl}
                onChange={e => updateContent({...content, profile: {...profile, photoUrl: e.target.value}})}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {profile.name}
          </h1>
          {isEditing ? (
            <input 
              className="mt-2 w-full text-xl md:text-2xl text-blue-600 dark:text-blue-400 bg-transparent border-b border-blue-300 dark:border-blue-700 outline-none focus:border-blue-500"
              value={profile.title[language]}
              onChange={(e) => updateContent({
                ...content, 
                profile: { ...profile, title: { ...profile.title, [language]: e.target.value } }
              })}
            />
          ) : (
            <h2 className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 mt-2 font-medium">
              {profile.title[language]}
            </h2>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-4 pt-2"
        >
          {isEditing ? (
            <div className="w-full space-y-3 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-bold uppercase text-slate-500">Edit Links</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500">Email</label>
                  <input className="w-full bg-white dark:bg-slate-900 border rounded p-1 outline-none" value={profile.email} onChange={e => updateContent({...content, profile: {...profile, email: e.target.value}})} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Phone</label>
                  <input className="w-full bg-white dark:bg-slate-900 border rounded p-1 outline-none" value={profile.phone} onChange={e => updateContent({...content, profile: {...profile, phone: e.target.value}})} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">LinkedIn</label>
                  <input className="w-full bg-white dark:bg-slate-900 border rounded p-1 outline-none" value={profile.linkedin} onChange={e => updateContent({...content, profile: {...profile, linkedin: e.target.value}})} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">GitHub</label>
                  <input className="w-full bg-white dark:bg-slate-900 border rounded p-1 outline-none" value={profile.github} onChange={e => updateContent({...content, profile: {...profile, github: e.target.value}})} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">CV URL (IT)</label>
                  <input className="w-full bg-white dark:bg-slate-900 border rounded p-1 outline-none" value={profile.cvItUrl} onChange={e => updateContent({...content, profile: {...profile, cvItUrl: e.target.value}})} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">CV URL (EN)</label>
                  <input className="w-full bg-white dark:bg-slate-900 border rounded p-1 outline-none" value={profile.cvEnUrl} onChange={e => updateContent({...content, profile: {...profile, cvEnUrl: e.target.value}})} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <motion.a variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={`mailto:${profile.email}`} className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-blue-600/20">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </motion.a>
              <motion.a variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-emerald-600/20">
                <Phone className="w-4 h-4" />
                <span>{language === 'en' ? 'Call' : 'Chiama'}</span>
              </motion.a>
              <motion.a variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-800 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg font-medium transition-colors shadow-sm">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </motion.a>
              <motion.a variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#0077b5] hover:bg-[#005e8f] text-white rounded-lg font-medium transition-colors shadow-sm">
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </motion.a>
              
              <motion.a variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={language === 'it' ? profile.cvItUrl : profile.cvEnUrl} download={language === 'it' ? "Angelo_Brambilla_CV_IT.pdf" : "Angelo_Brambilla_CV_EN.pdf"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg font-medium transition-colors shadow-sm group">
                <Download className="w-4 h-4" />
                <span>{language === 'en' ? 'Download CV' : 'Scarica CV'}</span>
              </motion.a>
            </>
          )}
        </motion.div>

        {/* Summary Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800/50"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === 'en' ? 'About Me' : 'Su di me'}
            </h3>
          </div>
          {isEditing ? (
            <textarea
              className="w-full h-48 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-4 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-y leading-relaxed"
              value={summary[language]}
              onChange={(e) => updateContent({
                ...content,
                summary: {
                  ...summary,
                  [language]: e.target.value
                }
              })}
            />
          ) : (
            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>{summary[language]}</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
