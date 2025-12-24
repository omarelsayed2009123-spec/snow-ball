import React, { useState } from 'react';
import { Task, SubStep } from '../types';
import { getAITaskBreakdown } from '../services/geminiService';
import { playSfx } from '../services/sfxService';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdate: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [newSubStep, setNewSubStep] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [editSubText, setEditSubText] = useState('');

  const completedSubStepsCount = task.subSteps.filter(s => s.completed).length;
  const totalSubSteps = task.subSteps.length;
  const progressPercentage = totalSubSteps === 0 
    ? (task.completed ? 100 : 0) 
    : Math.round((completedSubStepsCount / totalSubSteps) * 100);

  const handleToggleExpand = () => {
    playSfx.click();
    setIsExpanded(!isExpanded);
  };

  const handleSaveTitle = () => {
    if (!editTitle.trim()) {
      setEditTitle(task.title);
      setIsEditingTitle(false);
      return;
    }
    onUpdate({ ...task, title: editTitle.trim() });
    setIsEditingTitle(false);
    playSfx.success();
  };

  const handleAddSubStep = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newSubStep.trim()) return;
    playSfx.click();
    const updatedSubSteps: SubStep[] = [
      ...task.subSteps,
      { id: Date.now().toString(), text: newSubStep.trim(), completed: false }
    ];
    onUpdate({ ...task, subSteps: updatedSubSteps, completed: false });
    setNewSubStep('');
  };

  const toggleSubStep = (subId: string) => {
    const updatedSubSteps = task.subSteps.map(s => {
      if (s.id === subId) {
        if (!s.completed) playSfx.success();
        else playSfx.click();
        return { ...s, completed: !s.completed };
      }
      return s;
    });
    
    const allDone = updatedSubSteps.length > 0 && updatedSubSteps.every(s => s.completed);
    onUpdate({ ...task, subSteps: updatedSubSteps, completed: allDone });
  };

  const deleteSubStep = (subId: string) => {
    playSfx.click();
    const updatedSubSteps = task.subSteps.filter(s => s.id !== subId);
    onUpdate({ ...task, subSteps: updatedSubSteps });
  };

  const startEditSub = (sub: SubStep) => {
    playSfx.click();
    setEditingSubId(sub.id);
    setEditSubText(sub.text);
  };

  const saveEditSub = () => {
    if (!editSubText.trim()) {
      setEditingSubId(null);
      return;
    }
    playSfx.click();
    const updatedSubSteps = task.subSteps.map(s => 
      s.id === editingSubId ? { ...s, text: editSubText.trim() } : s
    );
    onUpdate({ ...task, subSteps: updatedSubSteps });
    setEditingSubId(null);
  };

  const handleAiBreakdown = async () => {
    playSfx.bloom();
    setIsAiLoading(true);
    const steps = await getAITaskBreakdown(task.title);
    if (steps.length > 0) {
      const newSteps: SubStep[] = steps.map(s => ({
        id: Math.random().toString(36).substr(2, 9),
        text: s,
        completed: false
      }));
      onUpdate({ ...task, subSteps: [...task.subSteps, ...newSteps], completed: false });
      setIsExpanded(true);
      playSfx.success();
    }
    setIsAiLoading(false);
  };

  return (
    <div className={`relative group w-full transition-all duration-500 ${isExpanded ? 'mb-4' : 'mb-0'}`}>
      <div className={`liquid-glass rounded-[2rem] overflow-hidden transition-all duration-700 ${isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}>
        <div className="px-8 py-6 flex items-center gap-6 relative">
          {/* Main Checkbox */}
          <button 
            onClick={() => onToggle(task.id)}
            className={`flex-shrink-0 h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-500 relative group/check ${
              task.completed 
                ? 'bg-white border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
                : 'bg-transparent border-white/20 hover:border-white/40'
            }`}
          >
            {task.completed && (
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Title Area */}
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <input 
                autoFocus
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                className="w-full bg-white/5 rounded-lg px-2 py-1 text-[17px] font-extrabold text-white focus:outline-none border border-white/10"
              />
            ) : (
              <div className="cursor-pointer group/title" onClick={() => handleToggleExpand()}>
                <h3 className={`text-[17px] font-extrabold transition-all truncate ${task.completed ? 'text-zinc-600 line-through opacity-50' : 'text-white/95 group-hover/title:text-white'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">{task.category}</span>
                  {totalSubSteps > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-white transition-all duration-1000" style={{ width: `${progressPercentage}%`, opacity: 0.5 }} />
                      </div>
                      <span className="text-[8px] text-zinc-600 font-bold">{completedSubStepsCount}/{totalSubSteps}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
             <button 
                onClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); playSfx.click(); }} 
                className="p-2 text-zinc-500 hover:text-white transition-colors"
                title="Edit Title"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
               </svg>
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
                className="p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                title="Delete Task"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
               </svg>
             </button>
          </div>
        </div>

        {/* Sub-steps Content */}
        <div className={`transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isExpanded ? 'max-h-[1000px] border-t border-white/5 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
          <div className="px-8 pb-8 pt-6">
             <div className="flex items-center justify-between mb-4">
               <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.4em]">Sub-steps</h4>
               <button 
                  onClick={handleAiBreakdown} 
                  disabled={isAiLoading} 
                  className="text-[8px] font-black uppercase text-zinc-500 hover:text-white flex items-center gap-2 group/ai transition-colors"
               >
                 <div className={`w-1 h-1 rounded-full bg-indigo-500 ${isAiLoading ? 'animate-ping' : 'group-hover/ai:scale-150 transition-transform'}`} />
                 {isAiLoading ? 'Generating...' : 'AI Breakdown'}
               </button>
             </div>

             <div className="space-y-2 mb-6">
                {task.subSteps.map(step => (
                  <div key={step.id} className="flex items-center gap-3 bg-white/[0.02] px-4 py-3 rounded-2xl border border-white/5 group/step hover:bg-white/[0.04] transition-all">
                    <button 
                      onClick={() => toggleSubStep(step.id)} 
                      className={`flex-shrink-0 h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                        step.completed ? 'bg-white border-white shadow-[0_0_8px_white]' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {step.completed && <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={8} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    
                    <div className="flex-1 min-w-0" onClick={() => editingSubId !== step.id && startEditSub(step)}>
                      {editingSubId === step.id ? (
                        <input 
                          autoFocus 
                          value={editSubText} 
                          onChange={(e) => setEditSubText(e.target.value)} 
                          onBlur={saveEditSub} 
                          onKeyDown={(e) => e.key === 'Enter' && saveEditSub()} 
                          className="w-full bg-transparent border-none text-[12px] text-white focus:outline-none" 
                        />
                      ) : (
                        <span className={`text-[12px] font-medium truncate cursor-text ${step.completed ? 'text-zinc-700 line-through opacity-40' : 'text-white/60 hover:text-white'}`}>
                          {step.text}
                        </span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => deleteSubStep(step.id)} 
                      className="opacity-0 group-hover/step:opacity-100 p-1 text-zinc-600 hover:text-rose-400 transition-all"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
             </div>

             <form onSubmit={handleAddSubStep} className="flex gap-2">
                <input 
                  type="text" 
                  value={newSubStep} 
                  onChange={(e) => setNewSubStep(e.target.value)} 
                  placeholder="Add a sub-step..." 
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-full px-5 py-2.5 text-[12px] text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 transition-all shadow-inner" 
                />
                <button 
                  type="submit" 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;