import React, { useState } from 'react';
import { Play, CheckCircle2, Coffee, Flame, Timer, Calendar, Award, RotateCcw, ChevronRight, Check } from 'lucide-react';
import { DayPlan, UserProgress } from '../types';
import { EXERCISE_LIBRARY } from '../data/exercises';

interface DashboardProps {
  customPlans: DayPlan[];
  progress: UserProgress;
  onStartWorkout: (day: number) => void;
  onToggleCompleteDayManually: (day: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  customPlans,
  progress,
  onStartWorkout,
  onToggleCompleteDayManually
}) => {
  const [selectedDayDetail, setSelectedDayDetail] = useState<number | null>(null);

  // Determine current active day
  const getCurrentDay = () => {
    for (let i = 1; i <= 30; i++) {
      if (!progress.completedDays.includes(i)) {
        return i;
      }
    }
    return 30; // completed all
  };

  const currentDay = getCurrentDay();
  const completionPercentage = Math.round((progress.completedDays.length / 30) * 100);

  // Aggregate stats
  const totalCompletedCount = progress.completedDays.length;
  const totalMinutes = Math.round(
    progress.history.reduce((acc, h) => acc + h.durationSeconds, 0) / 60
  );
  const totalCalories = Math.round(
    progress.history.reduce((acc, h) => acc + h.caloriesBurned, 0)
  );

  const activeDetailPlan = selectedDayDetail 
    ? customPlans.find(p => p.day === selectedDayDetail) 
    : customPlans.find(p => p.day === currentDay);

  const getDayStatus = (dayNum: number) => {
    const isCompleted = progress.completedDays.includes(dayNum);
    const plan = customPlans.find(p => p.day === dayNum);
    const isRest = plan?.isRestDay || false;
    const isActive = dayNum === currentDay;

    return { isCompleted, isRest, isActive };
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Progress Overview Hero Card */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6 text-[#E0E0E0] relative overflow-hidden">
        {/* Background ambient mesh */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4FF00]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] text-[10px] font-mono font-bold uppercase tracking-wider text-[#D4FF00] border border-[#222222]">
              <Award size={12} className="text-[#D4FF00] animate-bounce" /> 30-Day Core Challenge
            </div>
            
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide text-white">
                {progress.completedDays.length === 30 
                  ? 'Congratulations! You Crushed It!' 
                  : `Ready for Day ${currentDay}?`}
              </h1>
              <p className="text-[#888888] text-xs mt-1 max-w-lg leading-relaxed">
                {progress.completedDays.length === 30
                  ? 'You have fully finished the 30 days abs training challenge. Your core is stronger and shredded!'
                  : 'Progressive ab stimulation designed to slice core body fat and develop high-definition abdominal lines.'}
              </p>
            </div>

            {/* Overall Challenge Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-[#888888]">Challenge Progress</span>
                <span className="font-bold text-[#D4FF00]">{completionPercentage}% Completed</span>
              </div>
              <div className="w-full h-3 bg-[#111111] rounded-full overflow-hidden border border-[#222222]">
                <div 
                  className="h-full bg-[#D4FF00] rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(212,255,0,0.5)]"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-[#666666] font-mono">
                Completed: {progress.completedDays.length} of 30 workouts ({30 - progress.completedDays.length} remaining)
              </p>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col items-center sm:items-end justify-center">
            {progress.completedDays.length === 30 ? (
              <div className="p-4 bg-[#111111] border border-[#222222] rounded-2xl text-center">
                <p className="text-sm font-bold text-[#D4FF00]">COMPLETED</p>
                <p className="text-[10px] text-[#666666] mt-1">Check out your incredible stats below!</p>
              </div>
            ) : (
              <button
                onClick={() => onStartWorkout(currentDay)}
                className="w-full sm:w-auto px-6 py-4 bg-[#D4FF00] hover:brightness-110 text-black rounded-2xl font-black text-xs transition-transform hover:scale-103 shadow-lg shadow-[#D4FF00]/10 flex items-center justify-center gap-2 cursor-pointer group uppercase tracking-wide"
              >
                <Play size={16} fill="currentColor" className="group-hover:translate-x-0.5 transition-transform" />
                Start Day {currentDay} Workout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Days Count */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-[#111111] border border-[#222222] rounded-xl text-[#D4FF00]">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#666666] font-bold uppercase tracking-widest font-mono">Workouts Done</p>
            <p className="text-lg font-black text-white leading-tight font-mono">
              {totalCompletedCount} <span className="text-xs text-[#666666] font-normal">/ 30</span>
            </p>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-[#111111] border border-[#222222] rounded-xl text-[#D4FF00]">
            <Flame size={20} className={progress.streak > 0 ? 'animate-pulse' : ''} />
          </div>
          <div>
            <p className="text-[10px] text-[#666666] font-bold uppercase tracking-widest font-mono">Streak</p>
            <p className="text-lg font-black text-white leading-tight font-mono">
              {progress.streak} <span className="text-xs text-[#666666] font-normal">Days</span>
            </p>
          </div>
        </div>

        {/* Duration Total */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-[#111111] border border-[#222222] rounded-xl text-[#D4FF00]">
            <Timer size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#666666] font-bold uppercase tracking-widest font-mono">Total Duration</p>
            <p className="text-lg font-black text-white leading-tight font-mono">
              {totalMinutes} <span className="text-xs text-[#666666] font-normal">Mins</span>
            </p>
          </div>
        </div>

        {/* Calories Burned */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="p-3 bg-[#111111] border border-[#222222] rounded-xl text-[#D4FF00]">
            <Flame size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[#666666] font-bold uppercase tracking-widest font-mono">Energy Burned</p>
            <p className="text-lg font-black text-white leading-tight font-mono">
              {totalCalories} <span className="text-xs text-[#666666] font-normal">kcal</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 30-Day Challenge Grid */}
        <div className="lg:col-span-8 bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xs font-bold text-[#666666] uppercase tracking-widest font-mono">
                30-Day Roadmap
              </h2>
              <p className="text-[11px] text-[#888888] mt-1">Click any day to examine exercises or mark completion states manually.</p>
            </div>
            
            <span className="text-[10px] font-mono font-bold bg-[#111111] px-2.5 py-1 text-[#888888] border border-[#222222] rounded-lg">
              Calendar Grid
            </span>
          </div>

          {/* Grid list of days */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {customPlans.map(plan => {
              const { isCompleted, isRest, isActive } = getDayStatus(plan.day);

              return (
                <button
                  key={plan.day}
                  onClick={() => setSelectedDayDetail(plan.day)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer group ${
                    isCompleted
                      ? 'bg-[#D4FF00]/10 border-[#D4FF00]/30 text-[#D4FF00]'
                      : isRest
                        ? 'bg-[#111111] border-[#222222] text-[#888888]'
                        : isActive
                          ? 'border-2 border-[#D4FF00] bg-white text-black font-black scale-110 shadow-[0_0_15px_rgba(212,255,0,0.35)]'
                          : 'bg-transparent border-[#222222] hover:border-[#333333] text-[#555555]'
                  }`}
                >
                  <span className="text-xs font-mono font-bold leading-none">{plan.day}</span>
                  
                  {/* Status Indicator inside day button */}
                  <div className="mt-1">
                    {isCompleted ? (
                      <CheckCircle2 size={10} className="text-[#D4FF00] shrink-0" />
                    ) : isRest ? (
                      <Coffee size={10} className="text-[#888888] shrink-0" />
                    ) : isActive ? (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4FF00] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4FF00]"></span>
                      </span>
                    ) : (
                      <span className="text-[8px] font-mono text-[#666666]">
                        {plan.exercises.length} ex
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected/Active Day Detail Panel */}
        <div className="lg:col-span-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6 flex flex-col justify-between">
          {activeDetailPlan && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#D4FF00] bg-[#D4FF00]/10 px-2.5 py-1 rounded-md border border-[#D4FF00]/30 uppercase">
                  Details: Day {activeDetailPlan.day}
                </span>

                <button
                  onClick={() => onToggleCompleteDayManually(activeDetailPlan.day)}
                  className={`text-[10px] font-mono font-bold flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                    progress.completedDays.includes(activeDetailPlan.day)
                      ? 'bg-[#D4FF00]/10 border-[#D4FF00]/30 text-[#D4FF00]'
                      : 'bg-[#111111] hover:bg-[#1A1A1A] border-[#222222] text-[#E0E0E0]'
                  }`}
                >
                  <Check size={10} />
                  {progress.completedDays.includes(activeDetailPlan.day) ? 'Completed' : 'Mark Done'}
                </button>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base leading-snug">
                  {activeDetailPlan.title}
                </h3>
                <p className="text-[11px] text-[#888888] mt-1">
                  {activeDetailPlan.isRestDay 
                    ? 'Recovery day. Focus on muscle repair, light stretching, and healthy foods.' 
                    : `Core circuit consisting of ${activeDetailPlan.exercises.length} sequential exercises with rest intermissions.`}
                </p>
              </div>

              {!activeDetailPlan.isRestDay ? (
                <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                  {activeDetailPlan.exercises.map((item, index) => {
                    const exerciseDetail = EXERCISE_LIBRARY.find(e => e.id === item.exerciseId);
                    return (
                      <div key={index} className="flex items-center justify-between p-2.5 bg-[#111111] rounded-xl border border-[#222222]">
                        <div className="min-w-0 flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#666666] font-bold">{index + 1}</span>
                          <p className="text-xs font-bold text-[#E0E0E0] truncate">{exerciseDetail?.name}</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#888888] px-1.5 py-0.5 bg-[#050505] rounded border border-[#1A1A1A] shrink-0">
                          {item.durationSeconds}s
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center bg-[#111111] rounded-2xl border border-[#222222] flex flex-col items-center justify-center">
                  <Coffee size={32} className="text-[#888888] mb-2" />
                  <p className="text-xs font-bold text-white">Rest & Recharge Day</p>
                  <p className="text-[10px] text-[#888888] max-w-xs px-4 mt-1 leading-relaxed">
                    Allowing your body 24 hours of rest gives micro-tears in the muscles time to heal, build back thicker, and secure definition.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeDetailPlan && !activeDetailPlan.isRestDay && (
            <div className="pt-4 mt-4 border-t border-[#222222]">
              <button
                onClick={() => onStartWorkout(activeDetailPlan.day)}
                className="w-full py-3 bg-[#D4FF00] hover:brightness-110 text-black rounded-2xl font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wide shadow-[0_0_15px_rgba(212,255,0,0.15)]"
              >
                <Play size={14} fill="currentColor" /> Start Workout Day {activeDetailPlan.day}
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
