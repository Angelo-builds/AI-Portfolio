import { useStore } from '../store/useStore';
import { GraduationCap, MapPin, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function Education() {
  const { language, content } = useStore();
  const { education } = content;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="space-y-16"
    >
      
      {/* Education Section */}
      <section>
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl relative">
            <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {language === 'en' ? 'Education' : 'Istruzione'}
          </h2>
        </div>

        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1, ease: 'easeOut' } }
          }}
          className="grid gap-6"
        >
          {education.map((edu) => (
            <motion.div 
              key={edu.id} 
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
              }}
              whileHover={{ scale: 1.01 }}
              className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-slate-800/50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {edu.degree[language]}
                  </h3>
                  <div className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    {edu.school}
                  </div>
                  <div className="flex items-center space-x-4 mt-4 text-sm text-slate-500">
                    <span className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span>{edu.year}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{edu.location}</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

    </motion.div>
  );
}
