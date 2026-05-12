import { useStore } from '../store/useStore';
import { ExternalLink, Github, FolderGit2, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { EditableText } from '../components/EditableText';

export default function Projects() {
  const { language, content, isEditing, updateContent } = useStore();
  const { projects } = content;

  const updateProject = (id: string, field: string, value: string | string[]) => {
    updateContent({
      ...content,
      projects: projects.map(p => {
        if (p.id === id) {
          if (field.includes('.')) {
            const [base, lang] = field.split('.');
            return { ...p, [base]: { ...(p as any)[base], [lang]: value } };
          }
          return { ...p, [field]: value };
        }
        return p;
      })
    });
  };

  const deleteProject = (id: string) => {
    updateContent({ ...content, projects: projects.filter(p => p.id !== id) });
  };

  const addProject = () => {
    updateContent({
      ...content,
      projects: [
        ...projects,
        {
          id: `proj-${Date.now()}`,
          name: "Nuovo Progetto",
          description: { en: "Description here", it: "Descrizione qui" },
          technologies: ["React", "Tailwind"],
          github: "",
          url: ""
        }
      ]
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="space-y-12"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <FolderGit2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          {language === 'en' ? 'Featured Projects' : 'Progetti in Evidenza'}
        </h2>
        {isEditing && (
          <button onClick={addProject} className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
            <Plus className="w-4 h-4" /> <span>Add Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div 
            key={project.id} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.01 }}
            className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all relative"
          >
            {isEditing && (
              <button 
                onClick={() => deleteProject(project.id)}
                className="absolute top-4 right-4 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors w-full pr-10">
                  <EditableText 
                    value={project.name} 
                    onChange={val => updateProject(project.id, 'name', val)} 
                  />
                </h3>
                {!isEditing && (
                  <div className="flex gap-3">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="GitHub Repository">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors" title="Live Preview">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              
              {isEditing && (
                <div className="flex flex-col gap-2 mb-4">
                  <EditableText 
                    className="text-xs text-blue-500"
                    placeholder="GitHub URL"
                    value={project.github || ''} 
                    onChange={val => updateProject(project.id, 'github', val)} 
                  />
                  <EditableText 
                    className="text-xs text-green-500"
                    placeholder="Live URL"
                    value={project.url || ''} 
                    onChange={val => updateProject(project.id, 'url', val)} 
                  />
                </div>
              )}
              
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-1 whitespace-pre-wrap">
                <EditableText 
                  multiline
                  className="w-full text-sm"
                  value={project.description[language]} 
                  onChange={val => updateProject(project.id, `description.${language}`, val)} 
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                {isEditing ? (
                  <EditableText 
                    className="w-full text-xs font-mono text-blue-500"
                    value={project.technologies.join(', ')} 
                    onChange={val => updateProject(project.id, 'technologies', val.split(',').map(s => s.trim()))} 
                  />
                ) : (
                  project.technologies.map(tech => (
                    <span 
                      key={tech} 
                      className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50"
                    >
                      {tech}
                    </span>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
