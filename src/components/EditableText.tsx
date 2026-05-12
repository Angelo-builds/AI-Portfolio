import { useStore } from '../store/useStore';

export function EditableText({ 
  value, 
  onChange, 
  multiline = false, 
  className = "",
  placeholder = ""
}: { 
  value: string; 
  onChange: (val: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}) {
  const { isEditing } = useStore();

  if (!isEditing) {
    return <span className={className}>{value}</span>;
  }

  if (multiline) {
    return (
      <textarea 
        className={`w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <input 
      className={`w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1 outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
