import { useStore } from '../store/useStore';
import { BookOpen, Languages, Plus, Trash2, ArrowUp, ArrowDown, Code, Server, Wrench, Shield, Terminal, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { initialData } from '../data/content';
import { EditableText } from '../components/EditableText';

function getIconComponent(iconName: string | undefined) {
  switch (iconName) {
    case 'code': return <Code className="w-5 h-5 text-white" />;
    case 'server': return <Server className="w-5 h-5 text-white" />;
    case 'shield': return <Shield className="w-5 h-5 text-white" />;
    case 'terminal': return <Terminal className="w-5 h-5 text-white" />;
    case 'award': return <Award className="w-5 h-5 text-white" />;
    case 'wrench':
    default: return <Wrench className="w-5 h-5 text-white" />;
  }
}

export default function Skills() {
  const { language, content, isEditing, updateContent } = useStore();
  const { skills, languages } = content;
  const safeLanguages = languages?.length ? languages : initialData.languages;

  const updateSkillGroup = (index: number, field: string, value: any) => {
    const newSkills = [...skills];
    if (field.includes('.')) {
      const [base, lang] = field.split('.');
      newSkills[index] = { ...newSkills[index], [base]: { ...(newSkills[index] as any)[base], [lang]: value } };
    } else {
      newSkills[index] = { ...newSkills[index], [field]: value };
    }
    updateContent({ ...content, skills: newSkills });
  };

  const addSkillGroup = () => {
    updateContent({
      ...content,
      skills: [
        ...skills,
        {
          id: `skill-${Date.now()}`,
          category: { en: "New Category", it: "Nuova Categoria" },
          description: { en: "Description here", it: "Descrizione qui" },
          icon: "wrench",
          items: ["Skill 1", "Skill 2"]
        }
      ]
    });
  };

  const deleteSkillGroup = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    updateContent({ ...content, skills: newSkills });
  };

  const moveSkillGroup = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === skills.length - 1) return;
    const newSkills = [...skills];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSkills[index], newSkills[targetIndex]] = [newSkills[targetIndex], newSkills[index]];
    updateContent({ ...content, skills: newSkills });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="space-y-12"
    >
      {/* Technical Skills */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl relative">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {language === 'en' ? 'Skills & Competences' : 'Competenze'}
            </h2>
          </div>
          {isEditing && (
            <button onClick={addSkillGroup} className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
              <Plus className="w-4 h-4" /> <span>Add Category</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skillGroup, idx) => (
            <motion.div 
              key={skillGroup.id || idx} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
              className="relative bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col h-full hover:scale-[1.01]"
            >
              {isEditing && (
                <div className="absolute top-4 right-4 flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg z-10 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <button onClick={() => moveSkillGroup(idx, 'up')} disabled={idx === 0} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 rounded text-slate-600 dark:text-slate-400">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveSkillGroup(idx, 'down')} disabled={idx === skills.length - 1} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 rounded text-slate-600 dark:text-slate-400">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                  <button onClick={() => deleteSkillGroup(idx)} className="p-1.5 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40 dark:hover:text-red-400 rounded text-slate-600 dark:text-slate-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-4 mb-4 pr-24">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 dark:bg-teal-500 rounded-2xl flex items-center justify-center shadow-sm">
                  {getIconComponent(skillGroup.icon)}
                </div>
                <h3 className="text-2xl font-black text-blue-600 dark:text-teal-400 leading-tight">
                  <EditableText 
                    value={skillGroup.category[language]} 
                    onChange={val => updateSkillGroup(idx, `category.${language}`, val)} 
                  />
                </h3>
              </div>
              
              {(skillGroup.description || isEditing) && (
                <div className="text-slate-600 dark:text-slate-400 mb-6 text-sm flex-1">
                  <EditableText 
                    multiline
                    placeholder="Short description..."
                    value={skillGroup.description ? skillGroup.description[language] : ''} 
                    onChange={val => updateSkillGroup(idx, `description.${language}`, val)} 
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-auto">
                {isEditing ? (
                  <EditableText 
                    className="w-full text-xs font-mono text-teal-600 dark:text-teal-400"
                    value={skillGroup.items.join(', ')} 
                    onChange={val => updateSkillGroup(idx, 'items', val.split(',').map(s => s.trim()))} 
                  />
                ) : (
                  skillGroup.items.map((item, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-1.5 bg-teal-500 text-white text-sm font-bold rounded-full shadow-sm"
                    >
                      {item}
                    </span>
                  ))
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Spoken Languages */}
      <section>
        <div className="flex items-center space-x-3 mb-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl relative">
            <Languages className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {language === 'en' ? 'Languages' : 'Lingue Parlate'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeLanguages.map((lang, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
              className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:border-purple-300 dark:hover:border-purple-700/50 hover:scale-[1.01]"
            >
              <span className="font-bold text-slate-900 dark:text-white text-lg">{lang.name[language]}</span>
              <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold border border-purple-200 dark:border-purple-800/50">
                {lang.level}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
