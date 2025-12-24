import React, { useState, useEffect, useMemo } from 'react';
import { Task } from './types';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import { playSfx } from './services/sfxService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const saved = localStorage.getItem('snow-ball-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved tasks", e);
      }
    }
    
    const resumeAudio = () => {
      playSfx.click();
      window.removeEventListener('mousedown', resumeAudio);
    };
    window.addEventListener('mousedown', resumeAudio);
    return () => window.removeEventListener('mousedown', resumeAudio);
  }, []);

  useEffect(() => {
    localStorage.setItem('snow-ball-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleOpenAdd = () => {
    playSfx.bloom();
    setShowAddModal(true);
  };

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const isNowCompleted = !t.completed;
        if (isNowCompleted) playSfx.success();
        else playSfx.click();
        
        const updatedSubSteps = t.subSteps.map(s => ({ ...s, completed: isNowCompleted }));
        return { ...t, completed: isNowCompleted, subSteps: updatedSubSteps };
      }
      return t;
    }));
  };

  const deleteTask = (taskId: string) => {
    playSfx.click();
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active': return tasks.filter(t => !t.completed);
      case 'completed': return tasks.filter(t => t.completed);
      default: return tasks;
    }
  }, [tasks, filter]);

  const stats = useMemo(() => {
    if (tasks.length === 0) return { total: 0, completed: 0, percentage: 0 };
    
    const totalProgress = tasks.reduce((acc, task) => {
      if (task.subSteps.length === 0) {
        return acc + (task.completed ? 100 : 0);
      }
      const subStepProgress = (task.subSteps.filter(s => s.completed).length / task.subSteps.length) * 100;
      return acc + subStepProgress;
    }, 0);

    const percentage = Math.round(totalProgress / tasks.length);
    const completedCount = tasks.filter(t => t.completed).length;

    return {
      total: tasks.length,
      completed: completedCount,
      percentage
    };
  }, [tasks]);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (stats.percentage / 100) * circumference;

  return (
    <div className="min-h-screen pb-32 relative selection:bg-white selection:text-black">
      <header className="sticky top-6 z-40 mx-auto max-w-5xl px-6">
        <div className="liquid-glass rounded-full h-16 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            <h1 className="text-base font-extrabold tracking-tighter text-white uppercase italic">Snow ball</h1>
          </div>
          
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-full border border-white/5">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onMouseEnter={() => playSfx.hover()}
                onClick={() => { playSfx.click(); setFilter(f); }}
                className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  filter === f ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="liquid-glass rounded-[2.5rem] p-8 flex flex-col items-center text-center">
              <div className="mb-6">
                <h2 className="text-xl font-black text-white mb-1 uppercase tracking-tighter">Orb status</h2>
                <p className="text-zinc-500 text-[9px] font-black tracking-[0.4em] uppercase opacity-60">OVERALL PROGRESS</p>
              </div>
              
              <div className="relative w-32 h-32 flex items-center justify-center mb-8">
                <div className={`absolute inset-0 bg-white/10 rounded-full blur-2xl transition-all duration-1000 ${stats.percentage === 100 ? 'scale-125 opacity-40' : 'scale-90 opacity-20'}`} />
                
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 relative z-10">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.02)" strokeWidth="3" fill="transparent" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="#FFFFFF" strokeWidth="3" fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset} 
                    strokeLinecap="round" 
                    className="transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                  <span className="text-2xl font-black text-white leading-none tracking-tighter">{stats.percentage}%</span>
                </div>
              </div>
              
              <div className="w-full h-px bg-white/5 mb-6" />

              <div className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.1em] space-y-3 w-full">
                <div className="flex justify-between items-center px-2">
                  <span className="opacity-40">Crystallized</span>
                  <span className={`text-white transition-all ${stats.percentage === 100 ? 'text-indigo-400' : ''}`}>{stats.completed}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="opacity-40">In Motion</span>
                  <span className="text-white">{stats.total - stats.completed}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask} 
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                />
              ))
            ) : (
              <div className="text-center py-24 liquid-glass rounded-[2.5rem] border-dashed border-white/5">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 bg-white/[0.02]">
                  <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full animate-pulse" />
                </div>
                <h3 className="text-white/30 font-black text-lg uppercase tracking-[0.6em]">Clean Slate</h3>
                <p className="text-zinc-700 text-[8px] mt-4 font-black uppercase tracking-[0.3em]">Nothing in motion</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-10 right-10 z-50">
        <button 
          onClick={handleOpenAdd}
          onMouseEnter={() => playSfx.hover()}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-90 group overflow-hidden shadow-2xl shadow-white/10"
        >
          <svg className="w-8 h-8 text-black group-hover:rotate-90 transition-transform duration-500 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {showAddModal && <TaskForm onAdd={addTask} onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default App;