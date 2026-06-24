import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, Flame, CheckCircle, Timer } from 'lucide-react';
import { DayPlan, Exercise, AppSettings, WorkoutHistory } from '../types';
import { EXERCISE_LIBRARY } from '../data/exercises';
import { ExerciseVisuals } from './ExerciseVisuals';
import { SoundManager } from './SoundManager';

interface WorkoutPlayerProps {
  dayPlan: DayPlan;
  settings: AppSettings;
  onExit: () => void;
  onWorkoutCompleted: (historyItem: WorkoutHistory) => void;
}

type PlayerState = 'countdown' | 'exercise' | 'rest' | 'completed';

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  dayPlan,
  settings,
  onExit,
  onWorkoutCompleted
}) => {
  const [playerState, setPlayerState] = useState<PlayerState>('countdown');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(settings.countdownDuration);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  // Settings copy (local override allowed if muted)
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [voiceEnabled, setVoiceEnabled] = useState(settings.voiceEnabled);
  const [currentHumStyle, setCurrentHumStyle] = useState<'none' | 'zen' | 'rhythmic' | 'vibe'>(settings.humStyle || 'none');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalExercises = dayPlan.exercises.length;
  const currentExerciseConfig = dayPlan.exercises[currentExIndex];
  const currentExercise = EXERCISE_LIBRARY.find(e => e.id === currentExerciseConfig?.exerciseId);

  // Background session timer (measures actual elapsed seconds)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && playerState !== 'completed') {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playerState]);

  // Sync / play hum audio cues
  useEffect(() => {
    if (isPlaying && playerState === 'exercise' && soundEnabled && currentHumStyle !== 'none') {
      SoundManager.startHum(currentHumStyle);
    } else {
      SoundManager.stopHum();
    }
    return () => {
      SoundManager.stopHum();
    };
  }, [isPlaying, playerState, soundEnabled, currentHumStyle]);

  // Main countdown state machine tick
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleCountdownFinished();
          return 0;
        }

        // Sound indicators
        const nextSec = prev - 1;
        if (playerState === 'countdown' || playerState === 'rest') {
          if (nextSec <= 3 && nextSec > 0) {
            SoundManager.playCountdownBeep();
            SoundManager.speak(nextSec.toString(), voiceEnabled);
          }
        } else if (playerState === 'exercise') {
          if (nextSec <= 3 && nextSec > 0) {
            SoundManager.playBeep();
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playerState, secondsRemaining, currentExIndex, voiceEnabled]);

  // Trigger speech announcements when player states change
  useEffect(() => {
    if (playerState === 'countdown') {
      SoundManager.speak(`Get ready for Day ${dayPlan.day}, ${dayPlan.title}. Starting in 5 seconds.`, voiceEnabled);
    } else if (playerState === 'exercise' && currentExercise) {
      SoundManager.playGong();
      SoundManager.speak(`Begin, ${currentExercise.name}. ${currentExerciseConfig.durationSeconds} seconds.`, voiceEnabled);
    } else if (playerState === 'rest') {
      const nextExConfig = dayPlan.exercises[currentExIndex + 1];
      const nextEx = nextExConfig ? EXERCISE_LIBRARY.find(e => e.id === nextExConfig.exerciseId) : null;
      SoundManager.playSuccess();
      if (nextEx) {
        SoundManager.speak(`Take a rest. Up next: ${nextEx.name}.`, voiceEnabled);
      } else {
        SoundManager.speak("Take a rest. Almost finished.", voiceEnabled);
      }
    } else if (playerState === 'completed') {
      SoundManager.playSuccess();
      SoundManager.speak("Excellent work! You have completed today's workout. See your stats.", voiceEnabled);
    }
  }, [playerState, currentExIndex]);

  const handleCountdownFinished = () => {
    if (playerState === 'countdown') {
      // Transition from ready countdown to first exercise
      setPlayerState('exercise');
      setSecondsRemaining(dayPlan.exercises[0].durationSeconds);
    } else if (playerState === 'exercise') {
      // Transition from exercise to rest or completed
      if (currentExIndex < totalExercises - 1) {
        setPlayerState('rest');
        setSecondsRemaining(dayPlan.restBetweenSeconds || settings.defaultRestDuration);
      } else {
        // Workout Finished!
        triggerCompletion();
      }
    } else if (playerState === 'rest') {
      // Transition from rest to next exercise
      const nextIdx = currentExIndex + 1;
      setCurrentExIndex(nextIdx);
      setPlayerState('exercise');
      setSecondsRemaining(dayPlan.exercises[nextIdx].durationSeconds);
    }
  };

  const triggerCompletion = () => {
    setPlayerState('completed');
    setIsPlaying(false);

    // Calc calories
    let calTotal = 0;
    dayPlan.exercises.forEach(item => {
      const ex = EXERCISE_LIBRARY.find(e => e.id === item.exerciseId);
      if (ex) {
        calTotal += ex.caloriesPerMinute * (item.durationSeconds / 60);
      }
    });

    onWorkoutCompleted({
      date: new Date().toISOString().split('T')[0],
      dayCompleted: dayPlan.day,
      durationSeconds: sessionDuration,
      caloriesBurned: Math.round(calTotal)
    });
  };

  const handleSkip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (playerState === 'exercise') {
      if (currentExIndex < totalExercises - 1) {
        setPlayerState('rest');
        setSecondsRemaining(dayPlan.restBetweenSeconds || settings.defaultRestDuration);
      } else {
        triggerCompletion();
      }
    } else if (playerState === 'rest') {
      const nextIdx = currentExIndex + 1;
      setCurrentExIndex(nextIdx);
      setPlayerState('exercise');
      setSecondsRemaining(dayPlan.exercises[nextIdx].durationSeconds);
    }
  };

  const handleBack = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (currentExIndex > 0) {
      const prevIdx = currentExIndex - 1;
      setCurrentExIndex(prevIdx);
      setPlayerState('exercise');
      setSecondsRemaining(dayPlan.exercises[prevIdx].durationSeconds);
    } else {
      // Restart current exercise
      setSecondsRemaining(currentExerciseConfig.durationSeconds);
    }
  };

  // Skip countdown directly to starting
  const handleSkipCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPlayerState('exercise');
    setSecondsRemaining(dayPlan.exercises[0].durationSeconds);
  };

  // Aggregate workout metrics for congratulations screen
  const getWorkoutSummaryStats = () => {
    let calTotal = 0;
    dayPlan.exercises.forEach(item => {
      const ex = EXERCISE_LIBRARY.find(e => e.id === item.exerciseId);
      if (ex) {
        calTotal += ex.caloriesPerMinute * (item.durationSeconds / 60);
      }
    });
    return {
      calories: Math.round(calTotal),
      durationFormatted: `${Math.floor(sessionDuration / 60)}m ${sessionDuration % 60}s`,
      exercisesCount: totalExercises
    };
  };

  const renderContent = () => {
    switch (playerState) {
      case 'countdown':
        return (
          <div className="flex flex-col items-center justify-center text-center py-16 space-y-8 animate-fade-in">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D4FF00] bg-[#D4FF00]/10 border border-[#D4FF00]/20 px-3 py-1 rounded-full">
                Get Ready
              </span>
              <h2 className="text-2xl font-black uppercase tracking-wide text-white">
                Starting Day {dayPlan.day} Workout
              </h2>
              <p className="text-xs text-[#888888] font-mono max-w-sm">
                "{dayPlan.title}" • {dayPlan.exercises.length} Exercises
              </p>
            </div>

            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Spinning progress loader */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="72" cy="72" r="64" stroke="#111111" strokeWidth="8" fill="none" />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="64" 
                  stroke="#D4FF00" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeDasharray={402}
                  strokeDashoffset={402 - (402 * (secondsRemaining / settings.countdownDuration))}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <span className="text-4xl font-extrabold text-[#D4FF00] font-mono">{secondsRemaining}</span>
            </div>

            <div className="space-y-1 bg-[#111111] border border-[#222222] px-5 py-3 rounded-2xl max-w-xs">
              <p className="text-[10px] font-bold text-[#666666] uppercase tracking-widest font-mono">First exercise up:</p>
              <p className="text-xs font-bold text-white">
                {EXERCISE_LIBRARY.find(e => e.id === dayPlan.exercises[0].exerciseId)?.name}
              </p>
            </div>

            <button
              onClick={handleSkipCountdown}
              className="py-2.5 px-6 bg-[#111111] hover:bg-[#1A1A1A] text-white rounded-xl font-bold text-xs transition-colors cursor-pointer border border-[#222222]"
            >
              Skip Countdown
            </button>
          </div>
        );

      case 'exercise':
        if (!currentExercise) return null;
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Visual demo side */}
            <div className="md:col-span-6 space-y-4">
              <ExerciseVisuals imageType={currentExercise.imageType} isPlaying={isPlaying} exerciseId={currentExercise.id} />
              
              <div className="bg-[#111111] border border-[#222222] p-4 rounded-2xl">
                <h4 className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest mb-1">Trainer Tips:</h4>
                <p className="text-xs text-[#888888] leading-relaxed font-sans">
                  {currentExercise.instructions[0]} {currentExercise.instructions[1]}
                </p>
              </div>
            </div>

            {/* Timers & Controls side */}
            <div className="md:col-span-6 space-y-6 flex flex-col justify-between h-full min-h-[300px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D4FF00] bg-[#D4FF00]/10 px-2.5 py-1 rounded border border-[#D4FF00]/30">
                    Exercise {currentExIndex + 1} of {totalExercises}
                  </span>
                  
                  <span className="text-[11px] font-mono font-bold text-[#888888]">
                    Est. Calories: {Math.round(currentExercise.caloriesPerMinute * (currentExerciseConfig.durationSeconds / 60))} kcal
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-black uppercase tracking-wide text-white">
                    {currentExercise.name}
                  </h2>
                  <p className="text-xs text-[#888888] mt-1">{currentExercise.description}</p>
                </div>

                {/* Main countdown clock */}
                <div className="flex items-center gap-4 bg-[#111111] p-6 rounded-3xl border border-[#222222] justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-black text-[#D4FF00] tracking-tight font-mono">
                      {secondsRemaining}
                    </p>
                    <p className="text-[10px] text-[#666666] font-mono uppercase tracking-widest mt-1">Seconds Left</p>
                  </div>
                </div>

                {/* Ambient Hum Clips Panel */}
                <div className="bg-[#111111] p-4 rounded-3xl border border-[#222222] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#D4FF00] font-mono uppercase tracking-widest">
                      🔊 Human Hum Clips
                    </span>
                    {currentHumStyle !== 'none' && isPlaying && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4FF00] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4FF00]"></span>
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'none', name: 'Mute', desc: 'No Hum' },
                      { id: 'zen', name: 'Zen Deep', desc: 'Resonant Om' },
                      { id: 'rhythmic', name: 'Breathe', desc: 'In-Out Cadence' },
                      { id: 'vibe', name: 'Vibe Beat', desc: 'Focus Pulse' }
                    ].map(hum => (
                      <button
                        key={hum.id}
                        onClick={() => setCurrentHumStyle(hum.id as any)}
                        className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                          currentHumStyle === hum.id
                            ? 'bg-[#D4FF00]/10 border-[#D4FF00] text-[#D4FF00]'
                            : 'bg-[#0A0A0A] border-[#222222] text-[#888888] hover:bg-[#151515] hover:text-white'
                        }`}
                      >
                        <p className="text-[11px] font-black uppercase tracking-wide leading-none">{hum.name}</p>
                        <p className="text-[8px] font-mono mt-1 opacity-60 leading-none">{hum.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Player Controls Panel */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-[#1A1A1A]">
                <button
                  onClick={handleBack}
                  disabled={currentExIndex === 0 && secondsRemaining === currentExerciseConfig.durationSeconds}
                  className="p-3 bg-[#111111] hover:bg-[#1A1A1A] border border-[#222222] rounded-2xl text-[#E0E0E0] transition-colors cursor-pointer disabled:opacity-30"
                  title="Previous Exercise / Restart"
                >
                  <RotateCcw size={18} />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-4 rounded-3xl text-white transition-colors cursor-pointer shadow-lg ${
                    isPlaying 
                      ? 'bg-red-500 hover:brightness-110 shadow-red-500/10' 
                      : 'bg-[#D4FF00] hover:brightness-110 text-black shadow-[#D4FF00]/10'
                  }`}
                  title={isPlaying ? 'Pause' : 'Resume'}
                >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>

                <button
                  onClick={handleSkip}
                  className="p-3 bg-[#111111] hover:bg-[#1A1A1A] border border-[#222222] rounded-2xl text-[#E0E0E0] transition-colors cursor-pointer"
                  title="Skip / Rest"
                >
                  <SkipForward size={18} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'rest':
        const nextExConfig = dayPlan.exercises[currentExIndex + 1];
        const nextEx = nextExConfig ? EXERCISE_LIBRARY.find(e => e.id === nextExConfig.exerciseId) : null;

        return (
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-6 animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D4FF00] bg-[#D4FF00]/10 px-3 py-1 rounded-full border border-[#D4FF00]/30">
                Intermission Rest
              </span>
              <h2 className="text-xl font-black uppercase tracking-wide text-white">Take deep breaths</h2>
              <p className="text-xs text-[#888888]">Rest accelerates muscle oxygenation before the next circuit.</p>
            </div>

            <div className="text-5xl font-black text-[#D4FF00] font-mono tracking-tight animate-pulse">
              {secondsRemaining}s
            </div>

            {nextEx && (
              <div className="bg-[#111111] border border-[#222222] rounded-2xl p-4 max-w-sm w-full space-y-3">
                <div className="flex items-center justify-between border-b border-[#222222] pb-2">
                  <span className="text-[10px] font-mono text-[#666666] font-bold uppercase tracking-wider">Up Next (Queue {currentExIndex + 2}):</span>
                  <span className="text-[10px] font-mono font-bold bg-[#D4FF00]/10 text-[#D4FF00] border border-[#D4FF00]/20 px-2 py-0.5 rounded">
                    {nextExConfig.durationSeconds}s
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1A1A1A] border border-[#222222] text-[#D4FF00] rounded-xl shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold text-white truncate">{nextEx.name}</p>
                    <p className="text-[10px] text-[#888888] truncate mt-0.5">{nextEx.description}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSkip}
              className="py-2.5 px-6 bg-[#D4FF00] hover:brightness-110 text-black rounded-xl font-bold text-xs transition-colors cursor-pointer uppercase tracking-wide"
            >
              Skip Rest
            </button>
          </div>
        );

      case 'completed':
        const summary = getWorkoutSummaryStats();
        return (
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-8 animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-[#D4FF00] blur-sm opacity-30 animate-pulse" />
              <div className="relative p-4 bg-[#D4FF00] text-black rounded-full shadow-[0_0_20px_rgba(212,255,0,0.4)]">
                <CheckCircle size={40} className="stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">Workout Finished!</h2>
              <p className="text-xs text-[#888888] leading-relaxed max-w-sm">
                Sensational! You completed Day {dayPlan.day} challenge! Your future self is thanking you for this dedication.
              </p>
            </div>

            {/* Performance metrics */}
            <div className="grid grid-cols-3 gap-4 max-w-md w-full bg-[#111111] p-5 rounded-3xl border border-[#222222]">
              <div className="text-center space-y-1">
                <div className="p-2 bg-[#1A1A1A] border border-[#222222] rounded-xl text-[#D4FF00] mx-auto w-fit">
                  <Timer size={16} />
                </div>
                <p className="text-xs font-black text-white font-mono mt-1">
                  {summary.durationFormatted}
                </p>
                <p className="text-[9px] font-mono text-[#666666] uppercase tracking-wider">Duration</p>
              </div>

              <div className="text-center space-y-1">
                <div className="p-2 bg-[#1A1A1A] border border-[#222222] rounded-xl text-[#D4FF00] mx-auto w-fit">
                  <Flame size={16} />
                </div>
                <p className="text-xs font-black text-white font-mono mt-1">
                  {summary.calories} kcal
                </p>
                <p className="text-[9px] font-mono text-[#666666] uppercase tracking-wider">Burned</p>
              </div>

              <div className="text-center space-y-1">
                <div className="p-2 bg-[#1A1A1A] border border-[#222222] rounded-xl text-[#D4FF00] mx-auto w-fit">
                  <Sparkles size={16} />
                </div>
                <p className="text-xs font-black text-white font-mono mt-1">
                  {summary.exercisesCount} / {summary.exercisesCount}
                </p>
                <p className="text-[9px] font-mono text-[#666666] uppercase tracking-wider">Completed</p>
              </div>
            </div>

            <button
              onClick={onExit}
              className="py-3 px-8 bg-[#D4FF00] hover:brightness-110 text-black rounded-2xl font-black text-xs transition-colors uppercase tracking-wide shadow-[0_0_15px_rgba(212,255,0,0.25)]"
            >
              Back to Roadmap
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6">
      {/* Top Header Controls bar */}
      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4 mb-6">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-[#888888] hover:text-white font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Exit Workout
        </button>

        <div className="flex items-center gap-2">
          {/* Real-time speech togglers inside player */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled 
                ? 'bg-[#D4FF00]/10 border-[#D4FF00]/30 text-[#D4FF00]' 
                : 'bg-[#111111] border-[#222222] text-[#666666]'
            }`}
            title="Toggle Sound Synthesizer"
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              voiceEnabled 
                ? 'bg-[#D4FF00]/10 border-[#D4FF00]/30 text-[#D4FF00]' 
                : 'bg-[#111111] border-[#222222] text-[#666666]'
            }`}
            title="Toggle AI Voice Coach"
          >
            {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};
