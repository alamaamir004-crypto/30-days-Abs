import React, { useState } from 'react';
import { Search, Info, Dumbbell, Flame, CheckCircle, RefreshCw } from 'lucide-react';
import { EXERCISE_LIBRARY } from '../data/exercises';
import { ExerciseVisuals } from './ExerciseVisuals';
import { Exercise } from '../types';

export const ExerciseLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [activeVisual, setActiveVisual] = useState<Exercise | null>(EXERCISE_LIBRARY[0]);

  const groups = ['All', 'Upper Abs', 'Lower Abs', 'Obliques', 'Core'];

  const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'All' || ex.targetGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-black uppercase tracking-wide text-white flex items-center gap-2">
            <Dumbbell size={20} className="text-[#D4FF00]" />
            Exercise Encyclopedia
          </h2>
          <p className="text-xs text-[#888888]">Master your posture, form, and target the correct muscle groups.</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-64 rounded-2xl border border-[#222222] bg-[#111111] text-xs text-white focus:ring-1 focus:ring-[#D4FF00] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Target Muscle Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {groups.map(group => (
          <button
            key={group}
            onClick={() => setSelectedGroup(group)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
              selectedGroup === group
                ? 'bg-[#D4FF00] text-black font-black'
                : 'bg-[#111111] text-[#888888] hover:bg-[#1A1A1A] border border-[#222222]'
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Exercise List */}
        <div className="lg:col-span-7 space-y-3 max-h-[460px] overflow-y-auto pr-2 scrollbar-thin">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 text-[#666666] text-xs">
              No exercises match your search filters.
            </div>
          ) : (
            filteredExercises.map(ex => (
              <button
                key={ex.id}
                onClick={() => setActiveVisual(ex)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                  activeVisual?.id === ex.id
                    ? 'border-[#D4FF00] bg-[#D4FF00]/10 shadow-xs'
                    : 'border-[#222222] bg-[#0A0A0A] hover:bg-[#111111]'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  activeVisual?.id === ex.id 
                    ? 'bg-[#D4FF00]/20 text-[#D4FF00]' 
                    : 'bg-[#111111] text-[#666666]'
                }`}>
                  <Dumbbell size={16} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-white text-xs">
                      {ex.name}
                    </h4>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#111111] text-[#D4FF00] rounded border border-[#222222]">
                      {ex.targetGroup}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#888888] mt-1 line-clamp-2">
                    {ex.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2.5 text-[10px] font-mono text-[#666666]">
                    <span className="flex items-center gap-1">
                      <Flame size={12} className="text-[#D4FF00]" />
                      {ex.caloriesPerMinute} kcal/min
                    </span>
                    <span>•</span>
                    <span>Hold: {ex.durationSeconds}s</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Live Vector Preview Side */}
        <div className="lg:col-span-5 flex flex-col justify-between border border-[#222222] rounded-2xl p-4 bg-[#111111]/40">
          {activeVisual ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono text-[#D4FF00] uppercase tracking-wider">
                  Active Demonstration
                </span>
                <span className="text-[10px] text-[#666666] font-mono flex items-center gap-1">
                  <RefreshCw size={10} className="animate-spin-slow" /> Loop Active
                </span>
              </div>

              <ExerciseVisuals imageType={activeVisual.imageType} isPlaying={true} exerciseId={activeVisual.id} />

              <div>
                <h3 className="font-bold text-white text-sm">{activeVisual.name}</h3>
                <p className="text-[11px] text-[#888888] mt-1 leading-relaxed border-b border-[#222222] pb-3">
                  {activeVisual.description}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1 font-mono">
                  <Info size={12} className="text-[#D4FF00]" /> Execution Steps:
                </h4>
                <ol className="space-y-1.5">
                  {activeVisual.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] text-[#888888] leading-relaxed">
                      <CheckCircle size={12} className="text-[#D4FF00] shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#666666] py-12">
              <Dumbbell size={32} className="mb-2 opacity-50" />
              <p className="text-xs font-mono">Select an exercise to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
