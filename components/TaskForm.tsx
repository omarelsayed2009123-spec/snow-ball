import React, { useState } from 'react';
import { Task, TaskCategory } from '../types';
import { playSfx } from '../services/sfxService';

interface TaskFormProps {
  onAdd: (task: Task) => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('personal');

  const handleClose = () => {
    playSfx.click();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    playSfx.click();
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      subSteps: [], 
      category,
      createdAt: Date.now(),
    };

    onAdd(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Separate Backdrop with its own animation */}
      <div 
        className="absolute inset-0 bg-black/60 animate-backdrop" 
        onClick={handleClose} 
      />
      
      {/* Modal with the Vertical Reveal animation */}
      <div className="animate-vertical-reveal liquid-glass w-[92%] max-w-xl rounded-[2.5rem] p-10 shadow-2xl border-white/10 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
             <h2 className="text-[11px] font-black text-white uppercase tracking-[0.5em] opacity-90">Synthesize</h2>
          </div>
          <button onClick={handleClose} className="p-2.5 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all hover:bg-white/10">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="text-[9px] font-bold text-white/70 uppercase tracking-[0.3em] ml-2">Task</label>
            <input 
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-7 py-5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/40 text-lg font-bold transition-all shadow-inner"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[9px] font-bold text-white/70 uppercase tracking-[0.3em] ml-2">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add extra context here..."
              rows={4}
              className="w-full bg-white/[0.04] border border-white/10 rounded-3xl px-7 py-5 text-white/90 placeholder:text-zinc-700 focus:outline-none focus:border-white/40 text-sm font-medium transition-all resize-none shadow-inner leading-relaxed"
            />
          </div>

          <div className="space-y-4">
             <label className="text-[9px] font-bold text-white/70 uppercase tracking-[0.3em] ml-2">Type</label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['work', 'personal', 'urgent', 'growth'] as TaskCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onMouseEnter={() => playSfx.hover()}
                    onClick={() => { playSfx.click(); setCategory(cat); }}
                    className={`px-3 py-3 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      category === cat 
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] border-white' 
                        : 'bg-white/[0.02] border-white/5 text-zinc-500 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          <button 
            type="submit"
            onMouseEnter={() => playSfx.hover()}
            className="w-full bg-white text-black font-black uppercase tracking-[0.6em] text-[10px] py-6 rounded-full transition-all active:scale-95 flex items-center justify-center gap-4 group shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)]"
          >
            <span className="ml-4">Synchronize</span>
            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;