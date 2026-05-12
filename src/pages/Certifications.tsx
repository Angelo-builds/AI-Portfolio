import { useStore } from '../store/useStore';
import { Award, CheckCircle, Clock, BookMarked, GripVertical, Folder, ArrowUp, ArrowDown } from 'lucide-react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, useDroppable } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Certification } from '../data/content';
import { useState, ReactNode, useMemo } from 'react';
import { motion } from 'motion/react';

// Droppable Container for Folders/Statuses
function DroppableContainer({ id, children, className }: { id: string, children: ReactNode, className?: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`${className} transition-colors ${isOver ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
      {children}
    </div>
  );
}

// Draggable Certification Item
interface SortableCertItemProps {
  key?: string;
  cert: Certification;
  isEditing: boolean;
  activeId: string | null;
}
function SortableCertItem({ cert, isEditing, activeId }: SortableCertItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: cert.id,
    disabled: !isEditing,
    data: cert
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300 hover:border-green-300 dark:hover:border-green-700/50';
      case 'in-progress': return 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 hover:border-blue-300 dark:hover:border-blue-700/50';
      default: return 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600';
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative p-4 rounded-xl border ${getStatusColor(cert.status)} shadow-sm transition-all hover:shadow-md flex flex-col h-full hover:scale-[1.01]`}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h4 className="font-bold flex-1">{cert.name}</h4>
        {isEditing && (
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 -mt-1 -mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded"
          >
            <GripVertical className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-auto pt-2 flex flex-wrap items-center gap-3 text-sm opacity-80 font-medium">
        <span className="flex items-center gap-1"><Award className="w-4 h-4"/> {cert.vendor}</span>
        {cert.year && <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4"/> {cert.year}</span>}
      </div>
    </div>
  );
}

export default function Certifications() {
  const { language, content, isEditing, reorderCertifications, updateContent } = useStore();
  const { certifications } = content;
  
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const statuses = content.certificationStatuses || ['in-progress', 'completed', 'planned'];

  const moveStatus = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === statuses.length - 1) return;
    const newStatuses = [...statuses];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newStatuses[index], newStatuses[targetIndex]] = [newStatuses[targetIndex], newStatuses[index]];
    updateContent({ ...content, certificationStatuses: newStatuses });
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const activeCert = certifications.find(c => c.id === active.id);
      if (!activeCert) return;

      let newStatus = activeCert.status;
      let newFolder = activeCert.folder;
      let newIndex = certifications.length;

      const overStr = String(over.id);
      if (overStr.includes('::')) {
        const [oStatus, oFolder] = overStr.split('::');
        newStatus = oStatus as any;
        newFolder = oFolder === 'root' ? undefined : oFolder;
        // Dropped onto a generic container
      } else {
        const overCert = certifications.find(c => c.id === over.id);
        if (overCert) {
          newStatus = overCert.status;
          newFolder = overCert.folder;
          newIndex = certifications.findIndex(c => c.id === over.id);
        }
      }

      let newCerts = [...certifications];
      const oldIndex = newCerts.findIndex(c => c.id === active.id);
      
      const changedStatusOrFolder = newCerts[oldIndex].status !== newStatus || newCerts[oldIndex].folder !== newFolder;
      
      if (changedStatusOrFolder) {
        newCerts[oldIndex] = { ...newCerts[oldIndex], status: newStatus as any, folder: newFolder };
      }
      
      newCerts = arrayMove(newCerts, oldIndex, Math.min(newIndex, newCerts.length - 1));
      reorderCertifications(newCerts);
    }
  };

  const getColumnIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-progress': return <Clock className="w-6 h-6 text-blue-500" />;
      default: return <BookMarked className="w-6 h-6 text-slate-500" />;
    }
  };

  const getColumnTitle = (status: string) => {
    switch (status) {
      case 'completed': return language === 'en' ? 'Completed' : 'Completate';
      case 'in-progress': return language === 'en' ? 'In Progress' : 'In Corso';
      default: return language === 'en' ? 'Planned' : 'Pianificate';
    }
  };

  const activeCert = activeId ? certifications.find(c => c.id === activeId) : null;

  const visibleStatuses = isEditing ? statuses : statuses.filter(s => s !== 'planned');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {language === 'en' ? 'Certifications' : 'Certificazioni'}
        </h2>
        {isEditing && (
          <span className="text-xs font-medium px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
            {language === 'en' ? 'Drag & Drop enabled' : 'Drag & Drop attivato'}
          </span>
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-8">
          {visibleStatuses.map(status => {
            const statusCerts = certifications.filter(c => c.status === status);
            const foldersSet = new Set(statusCerts.map(c => c.folder || 'root'));
            const folders = Array.from(foldersSet).sort();

            return (
              <motion.div 
                key={status} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                  {getColumnIcon(status)}
                  <h3 className="font-bold text-2xl text-slate-900 dark:text-white">{getColumnTitle(status)}</h3>
                  
                  {isEditing && (
                    <div className="ml-4 flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <button 
                        onClick={() => moveStatus(statuses.indexOf(status), 'up')}
                        disabled={statuses.indexOf(status) === 0}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => moveStatus(statuses.indexOf(status), 'down')}
                        disabled={statuses.indexOf(status) === statuses.length - 1}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 transition-colors"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <span className="ml-auto bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold px-3 py-1 rounded-full">
                    {statusCerts.length}
                  </span>
                </div>
                
                {folders.length === 0 ? (
                  <DroppableContainer id={`${status}::root`} className="flex-1 flex flex-col p-8 items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                      {language === 'en' ? 'No certifications at the moment' : 'Nessuna certificazione al momento'}
                    </span>
                  </DroppableContainer>
                ) : (
                  <div className="flex flex-col gap-6">
                    {folders.map(folder => {
                      const folderCerts = statusCerts.filter(c => (c.folder || 'root') === folder);
                      const containerId = `${status}::${folder}`;
                      
                      return (
                        <div key={folder} className="flex flex-col gap-3">
                          {folder !== 'root' && (
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <Folder className="w-4 h-4" />
                              <h4 className="font-semibold text-sm uppercase tracking-wider">{folder}</h4>
                            </div>
                          )}
                          <DroppableContainer id={containerId} className="min-h-[80px] p-1 -m-1 rounded-xl">
                            <SortableContext 
                              id={containerId}
                              items={folderCerts.map(c => c.id)} 
                              strategy={rectSortingStrategy}
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {folderCerts.map(cert => (
                                  <SortableCertItem key={cert.id} cert={cert} isEditing={isEditing} activeId={activeId} />
                                ))}
                              </div>
                            </SortableContext>
                          </DroppableContainer>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Drag Overlay for smooth dragging UX */}
        <DragOverlay>
          {activeCert ? (
             <div className="p-4 rounded-xl border-2 border-blue-400 bg-white dark:bg-slate-800 shadow-2xl opacity-90 scale-105">
                <h4 className="font-bold">{activeCert.name}</h4>
             </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </motion.div>
  );
}
