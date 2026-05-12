import { useStore } from '../store/useStore';
import { Briefcase, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Experience() {
  const { language, content } = useStore();
  const { experience } = content;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="space-y-12"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {language === 'en' ? 'Professional Experience' : 'Esperienza Professionale'}
        </h2>
      </div>

      <div className="space-y-6 md:space-y-8">
        {experience.map((exp, index) => (
          <motion.div 
            key={exp.id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col md:flex-row gap-4 md:gap-8 items-start"
          >
            {/* Desktop Timeline Dates */}
            <div className="hidden md:block w-48 shrink-0 text-right pt-2">
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {exp.period[language]}
              </div>
              <div className="text-sm text-slate-500 mt-1 flex items-center justify-end space-x-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{exp.location}</span>
              </div>
            </div>

            {/* Timeline Line & Dot */}
            <div className="hidden md:flex flex-col items-center self-stretch">
              <div className="w-5 h-5 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-600 dark:border-blue-400 mt-2 z-10" />
              <div className="w-px h-full bg-slate-200 dark:bg-slate-800 -my-1" />
            </div>

            {/* Mobile Timeline Container */}
            <div className="md:hidden flex space-x-4 w-full">
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-600 dark:border-blue-400 mt-2 z-10" />
                <div className="w-px h-full bg-slate-200 dark:bg-slate-800 -my-1" />
              </div>
              <div className="flex-1 pb-8">
                <div className="mb-4 pt-1.5">
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.period[language]}</span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {exp.role[language]}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                        {exp.url ? (
                          <a href={exp.url} target="_blank" rel="noreferrer" className="font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {exp.company}
                          </a>
                        ) : (
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {exp.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {exp.description[language].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mr-3 mt-0.5" />
                        <span className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Desktop Content Area */}
            <div className="hidden md:block flex-1 pb-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {exp.role[language]}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                      {exp.url ? (
                        <a href={exp.url} target="_blank" rel="noreferrer" className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {exp.company}
                        </a>
                      ) : (
                        <span className="text-lg font-medium text-slate-700 dark:text-slate-300">
                          {exp.company}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <ul className="space-y-3">
                  {exp.description[language].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mr-3 mt-0.5" />
                      <span className="text-slate-600 dark:text-slate-400 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
