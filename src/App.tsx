import React, { useState, useEffect } from 'react';
import { Calendar, Dumbbell, Settings, Flame, Trophy, Award, Sparkles, Activity } from 'lucide-react';
import { THIRTY_DAYS_PLAN } from './data/workouts';
import { UserProgress, AppSettings, DayPlan, WorkoutHistory } from './types';

// Components
import { Dashboard } from './components/Dashboard';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { WorkoutManager } from './components/WorkoutManager';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { ExtraFeatures } from './components/ExtraFeatures';

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  voiceEnabled: true,
  defaultRestDuration: 15,
  countdownDuration: 5
};

const DEFAULT_PROGRESS: UserProgress = {
  completedDays: [],
  streak: 0,
  lastCompletedDate: null,
  history: [],
  waterLog: {},
  weightHistory: []
};

export default function App() {
  const [currentView, setCurrentView] = useState<'roadmap' | 'library' | 'manager' | 'player'>('roadmap');
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<number | null>(null);

  // Core application states
  const [customPlans, setCustomPlans] = useState<DayPlan[]>([]);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load state from localStorage on mount
  useEffect(() => {
    // 1. Load workout plans
    const savedPlans = localStorage.getItem('abs30_custom_plans');
    if (savedPlans) {
      try {
        const parsed = JSON.parse(savedPlans) as DayPlan[];
        let changed = false;
        const migrated = parsed.map((plan) => {
          if (plan.isRestDay) return plan;
          
          let exercises = [...plan.exercises];
          
          // Set duration to 60 for all
          exercises = exercises.map(ex => {
            if (ex.durationSeconds !== 60) {
              changed = true;
              return { ...ex, durationSeconds: 60 };
            }
            return ex;
          });

          // Pad up to 6 exercises if there are fewer
          if (exercises.length < 6) {
            changed = true;
            const defaultDayPlan = THIRTY_DAYS_PLAN.find(p => p.day === plan.day);
            if (defaultDayPlan) {
              exercises = [...defaultDayPlan.exercises];
            } else {
              const availableExs = ['crunch', 'heel_touch', 'plank', 'leg_raise', 'reverse_crunch', 'cobra_stretch'];
              while (exercises.length < 6) {
                const nextExId = availableExs[exercises.length % availableExs.length];
                if (!exercises.some(e => e.exerciseId === nextExId)) {
                  exercises.push({ exerciseId: nextExId, durationSeconds: 60 });
                } else {
                  exercises.push({ exerciseId: 'cobra_stretch', durationSeconds: 60 });
                }
              }
            }
          }
          
          return { ...plan, exercises };
        });

        if (changed) {
          localStorage.setItem('abs30_custom_plans', JSON.stringify(migrated));
        }
        setCustomPlans(migrated);
      } catch (e) {
        setCustomPlans(THIRTY_DAYS_PLAN);
      }
    } else {
      setCustomPlans(THIRTY_DAYS_PLAN);
    }

    // 2. Load progress
    const savedProgress = localStorage.getItem('abs30_progress');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        setProgress(DEFAULT_PROGRESS);
      }
    } else {
      setProgress(DEFAULT_PROGRESS);
    }

    // 3. Load settings
    const savedSettings = localStorage.getItem('abs30_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        setSettings(DEFAULT_SETTINGS);
      }
    } else {
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  // Sync state to localStorage on changes
  const savePlansToStorage = (plans: DayPlan[]) => {
    setCustomPlans(plans);
    localStorage.setItem('abs30_custom_plans', JSON.stringify(plans));
  };

  const saveProgressToStorage = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('abs30_progress', JSON.stringify(newProgress));
  };

  const saveSettingsToStorage = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('abs30_settings', JSON.stringify(newSettings));
  };

  // Start a dynamic active workout session
  const handleStartWorkout = (dayNum: number) => {
    const plan = customPlans.find(p => p.day === dayNum);
    if (plan) {
      if (plan.isRestDay) {
        // Toggle rest day completed directly since there is no exercise
        handleToggleCompleteDayManually(dayNum);
        alert(`Day ${dayNum} is a recovery rest day! Progress marked.`);
      } else {
        setActiveWorkoutDay(dayNum);
        setCurrentView('player');
      }
    }
  };

  // Complete a full workout sequence
  const handleWorkoutCompleted = (historyItem: WorkoutHistory) => {
    const updatedHistory = [...progress.history, historyItem];
    
    // Add completed day uniquely
    const updatedCompletedDays = progress.completedDays.includes(historyItem.dayCompleted)
      ? progress.completedDays
      : [...progress.completedDays, historyItem.dayCompleted].sort((a, b) => a - b);

    // Calculate dynamic streaks
    const todayStr = new Date().toISOString().split('T')[0];
    let newStreak = progress.streak;

    if (progress.lastCompletedDate) {
      const lastDate = new Date(progress.lastCompletedDate);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        // Streak continues or stays same for multiple completions today
        if (progress.lastCompletedDate !== todayStr) {
          newStreak += 1;
        }
      } else {
        // Streak was broken, reset to 1
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const updatedProgress = {
      ...progress,
      completedDays: updatedCompletedDays,
      streak: newStreak,
      lastCompletedDate: todayStr,
      history: updatedHistory
    };

    saveProgressToStorage(updatedProgress);
  };

  // Toggle days completed state manually on the dashboard
  const handleToggleCompleteDayManually = (dayNum: number) => {
    const isCompleted = progress.completedDays.includes(dayNum);
    let updatedCompletedDays = [...progress.completedDays];

    if (isCompleted) {
      updatedCompletedDays = updatedCompletedDays.filter(d => d !== dayNum);
    } else {
      updatedCompletedDays = [...updatedCompletedDays, dayNum].sort((a, b) => a - b);
    }

    // Adjust streak
    let newStreak = progress.streak;
    const todayStr = new Date().toISOString().split('T')[0];
    if (!isCompleted) {
      if (progress.lastCompletedDate === null) {
        newStreak = 1;
      } else if (progress.lastCompletedDate !== todayStr) {
        newStreak += 1;
      }
    }

    const updatedProgress = {
      ...progress,
      completedDays: updatedCompletedDays,
      streak: Math.max(0, newStreak),
      lastCompletedDate: !isCompleted ? todayStr : progress.lastCompletedDate,
    };

    saveProgressToStorage(updatedProgress);
  };

  // Update Hydration water log
  const handleUpdateWater = (glasses: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedWaterLog = {
      ...progress.waterLog,
      [todayStr]: glasses
    };

    saveProgressToStorage({
      ...progress,
      waterLog: updatedWaterLog
    });
  };

  // Add historical weight entry
  const handleAddWeight = (weight: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedWeightHistory = [
      ...progress.weightHistory,
      { date: todayStr, weight }
    ];

    saveProgressToStorage({
      ...progress,
      weightHistory: updatedWeightHistory
    });
  };

  // Delete historical weight entry
  const handleDeleteWeight = (index: number) => {
    const updatedWeightHistory = progress.weightHistory.filter((_, idx) => idx !== index);
    saveProgressToStorage({
      ...progress,
      weightHistory: updatedWeightHistory
    });
  };

  // Full reset option for testing
  const handleResetAllData = () => {
    if (window.confirm('WARNING: This will permanently delete all of your workouts completion progress, water tracker logs, weight history logs, and custom schedules. Are you sure you want to proceed?')) {
      localStorage.clear();
      setProgress(DEFAULT_PROGRESS);
      setSettings(DEFAULT_SETTINGS);
      setCustomPlans(THIRTY_DAYS_PLAN);
      setCurrentView('roadmap');
      setActiveWorkoutDay(null);
      alert('Application data fully wiped.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-[#D4FF00]/20 selection:text-[#D4FF00] pb-24 md:pb-16">
      
      {/* Visual top highlight strip */}
      <div className="h-1 bg-[#D4FF00] w-full shadow-[0_0_15px_rgba(212,255,0,0.4)]" />

      {/* Main Header / Navigation Container */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-[#1A1A1A]">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#D4FF00] text-black rounded-xl">
              <Activity size={18} className="animate-pulse" />
            </div>
            <div>
              <span className="font-black text-sm tracking-wide text-white uppercase">Core30 Challenge</span>
              <span className="text-[10px] block font-mono text-[#D4FF00] font-medium leading-none tracking-widest">30 DAYS PROGRESSIVE CORE</span>
            </div>
          </div>

          {/* Navigation Controls - Hidden on mobile, visible on desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => { setCurrentView('roadmap'); setActiveWorkoutDay(null); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                currentView === 'roadmap' || currentView === 'player'
                  ? 'bg-[#111111] text-[#D4FF00] border border-[#222222]'
                  : 'text-[#888888] hover:text-white hover:bg-[#111111]'
              }`}
            >
              <Calendar size={14} /> Daily Routine
            </button>
            <button
              onClick={() => { setCurrentView('library'); setActiveWorkoutDay(null); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                currentView === 'library'
                  ? 'bg-[#111111] text-[#D4FF00] border border-[#222222]'
                  : 'text-[#888888] hover:text-white hover:bg-[#111111]'
              }`}
            >
              <Dumbbell size={14} /> Exercise Library
            </button>
            <button
              onClick={() => { setCurrentView('manager'); setActiveWorkoutDay(null); }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                currentView === 'manager'
                  ? 'bg-[#111111] text-[#D4FF00] border border-[#222222]'
                  : 'text-[#888888] hover:text-white hover:bg-[#111111]'
              }`}
            >
              <Settings size={14} /> Workout Manager
            </button>
          </nav>
        </div>
      </header>

      {/* Main Page Layout Container */}
      <main className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* Active Player View Override */}
        {currentView === 'player' && activeWorkoutDay !== null ? (
          <WorkoutPlayer
            dayPlan={customPlans.find(p => p.day === activeWorkoutDay) || customPlans[0]}
            settings={settings}
            onExit={() => { setCurrentView('roadmap'); setActiveWorkoutDay(null); }}
            onWorkoutCompleted={handleWorkoutCompleted}
          />
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* View Switching router */}
            {currentView === 'roadmap' && (
              <>
                <Dashboard
                  customPlans={customPlans}
                  progress={progress}
                  onStartWorkout={handleStartWorkout}
                  onToggleCompleteDayManually={handleToggleCompleteDayManually}
                />
                
                {/* Embedded extra trackers at the bottom of Dashboard */}
                <ExtraFeatures
                  progress={progress}
                  onUpdateWater={handleUpdateWater}
                  onAddWeight={handleAddWeight}
                  onDeleteWeight={handleDeleteWeight}
                />
              </>
            )}

            {currentView === 'library' && (
              <ExerciseLibrary />
            )}

            {currentView === 'manager' && (
              <WorkoutManager
                customPlans={customPlans}
                settings={settings}
                onSavePlans={savePlansToStorage}
                onUpdateSettings={saveSettingsToStorage}
                onResetAllData={handleResetAllData}
              />
            )}
          </div>
        )}
      </main>

      {/* Sticky Bottom Navigation Bar for Mobile (dont in up do in down) */}
      {currentView !== 'player' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A0A0A]/90 backdrop-blur-lg border-t border-[#1A1A1A] px-6 py-3 flex items-center justify-around shadow-[0_-5px_25px_rgba(0,0,0,0.8)] pb-safe">
          <button
            onClick={() => { setCurrentView('roadmap'); setActiveWorkoutDay(null); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              currentView === 'roadmap' || currentView === 'player'
                ? 'text-[#D4FF00] scale-105'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Calendar size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Routine</span>
          </button>

          <button
            onClick={() => { setCurrentView('library'); setActiveWorkoutDay(null); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              currentView === 'library'
                ? 'text-[#D4FF00] scale-105'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Dumbbell size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Library</span>
          </button>

          <button
            onClick={() => { setCurrentView('manager'); setActiveWorkoutDay(null); }}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
              currentView === 'manager'
                ? 'text-[#D4FF00] scale-105'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Settings size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Manager</span>
          </button>
        </div>
      )}
    </div>
  );
}
