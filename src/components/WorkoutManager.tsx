import React, { useState } from 'react';
import { Settings, RefreshCw, Trash2, Plus, ArrowUp, ArrowDown, Save, Volume2, VolumeX, Eye, Flame, Dumbbell } from 'lucide-react';
import { DayPlan, AppSettings, Exercise } from '../types';
import { EXERCISE_LIBRARY } from '../data/exercises';

interface WorkoutManagerProps {
  customPlans: DayPlan[];
  settings: AppSettings;
  onSavePlans: (updatedPlans: DayPlan[]) => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetAllData: () => void;
}

export const WorkoutManager: React.FC<WorkoutManagerProps> = ({
  customPlans,
  settings,
  onSavePlans,
  onUpdateSettings,
  onResetAllData
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [editingPlan, setEditingPlan] = useState<DayPlan | null>(null);
  const [addingExId, setAddingExId] = useState<string>(EXERCISE_LIBRARY[0].id);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Load the current plan for editing when selected day changes
  React.useEffect(() => {
    const plan = customPlans.find(p => p.day === selectedDay);
    if (plan) {
      // Create a deep copy for editing
      setEditingPlan(JSON.parse(JSON.stringify(plan)));
    }
  }, [selectedDay, customPlans]);

  const handleFieldChange = (field: keyof DayPlan, value: any) => {
    if (!editingPlan) return;
    setEditingPlan({ ...editingPlan, [field]: value });
  };

  const handleExerciseDurationChange = (index: number, val: number) => {
    if (!editingPlan) return;
    const updatedExercises = [...editingPlan.exercises];
    updatedExercises[index].durationSeconds = Math.max(5, val);
    setEditingPlan({ ...editingPlan, exercises: updatedExercises });
  };

  const handleAddExercise = () => {
    if (!editingPlan) return;
    const ex = EXERCISE_LIBRARY.find(e => e.id === addingExId);
    if (!ex) return;
    
    const updatedExercises = [...editingPlan.exercises, {
      exerciseId: addingExId,
      durationSeconds: ex.durationSeconds
    }];
    setEditingPlan({ ...editingPlan, exercises: updatedExercises });
  };

  const handleRemoveExercise = (index: number) => {
    if (!editingPlan) return;
    const updatedExercises = editingPlan.exercises.filter((_, idx) => idx !== index);
    setEditingPlan({ ...editingPlan, exercises: updatedExercises });
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if (!editingPlan) return;
    const updatedExercises = [...editingPlan.exercises];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIdx < 0 || targetIdx >= updatedExercises.length) return;
    
    const temp = updatedExercises[index];
    updatedExercises[index] = updatedExercises[targetIdx];
    updatedExercises[targetIdx] = temp;
    
    setEditingPlan({ ...editingPlan, exercises: updatedExercises });
  };

  const handleSaveDayPlan = () => {
    if (!editingPlan) return;
    const updatedPlans = customPlans.map(p => p.day === selectedDay ? editingPlan : p);
    onSavePlans(updatedPlans);
    setSaveFeedback(`Day ${selectedDay} customized successfully!`);
    setTimeout(() => {
      setSaveFeedback(null);
    }, 3500);
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Are you sure you want to restore the entire 30 days challenge back to default? All of your customized exercises for each day will be overwritten.')) {
      localStorage.removeItem('abs30_custom_plans');
      window.location.reload();
    }
  };

  const toggleSound = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const toggleVoice = () => {
    onUpdateSettings({ ...settings, voiceEnabled: !settings.voiceEnabled });
  };

  const handleRestConfigChange = (val: number) => {
    onUpdateSettings({ ...settings, defaultRestDuration: Math.max(5, val) });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Settings Panel & Global Actions - order-2 on mobile, lg:order-1 on desktop */}
      <div className="order-2 lg:order-1 lg:col-span-4 space-y-6 animate-fade-in">
        {/* Global Settings Card */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-4">
            <Settings size={18} className="text-[#D4FF00]" />
            Global Settings
          </h3>
          
          <div className="space-y-4">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#111111] rounded-xl border border-[#222222]">
              <div>
                <p className="text-xs font-bold text-white">Synth Sound Cues</p>
                <p className="text-[10px] text-[#888888]">Beep & gong synthesizer cues</p>
              </div>
              <button
                onClick={toggleSound}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  settings.soundEnabled
                    ? 'bg-[#D4FF00]/10 border border-[#D4FF00]/30 text-[#D4FF00]'
                    : 'bg-[#222222] text-[#666666]'
                }`}
              >
                {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>

            {/* Voice Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#111111] rounded-xl border border-[#222222]">
              <div>
                <p className="text-xs font-bold text-white">AI Voice Coach</p>
                <p className="text-[10px] text-[#888888]">Vocal prompts & rest counts</p>
              </div>
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  settings.voiceEnabled
                    ? 'bg-[#D4FF00]/10 border border-[#D4FF00]/30 text-[#D4FF00]'
                    : 'bg-[#222222] text-[#666666]'
                }`}
              >
                {settings.voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>

            {/* Rest Duration */}
            <div>
              <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-1.5 font-mono">
                Default Rest Duration (s)
              </label>
              <input
                type="number"
                min="5"
                max="90"
                value={settings.defaultRestDuration}
                onChange={(e) => handleRestConfigChange(parseInt(e.target.value) || 15)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#111111] text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-[#D4FF00] font-mono"
              />
            </div>

            {/* Countdown Duration */}
            <div>
              <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-1.5 font-mono">
                Get Ready Countdown (s)
              </label>
              <input
                type="number"
                min="3"
                max="30"
                value={settings.countdownDuration}
                onChange={(e) => onUpdateSettings({ ...settings, countdownDuration: Math.max(3, parseInt(e.target.value) || 5) })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#111111] text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-[#D4FF00] font-mono"
              />
            </div>

            {/* Default Hum Style Preference */}
            <div>
              <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-1.5 font-mono">
                Default Hum Style
              </label>
              <select
                value={settings.humStyle || 'none'}
                onChange={(e) => onUpdateSettings({ ...settings, humStyle: e.target.value as any })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#222222] bg-[#111111] text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-[#D4FF00] font-mono"
              >
                <option value="none">Muted (No Hum)</option>
                <option value="zen">Zen Deep (Resonant Om)</option>
                <option value="rhythmic">Rhythmic Breathe (In-Out Cadence)</option>
                <option value="vibe">Vibe Beat (Workout Focus Pulse)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950/10 border border-red-900/30 rounded-3xl p-6">
          <h3 className="font-bold text-red-400 text-sm mb-1">Danger Zone</h3>
          <p className="text-[11px] text-red-500 mb-4">Irreversible management tools. Be cautious.</p>
          
          <div className="space-y-3">
            <button
              onClick={handleRestoreDefaults}
              className="w-full py-2.5 px-4 bg-[#111111] hover:bg-[#1A1A1A] border border-red-900/40 text-red-400 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} /> Restore Default Workouts
            </button>
            <button
              onClick={onResetAllData}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={14} /> Delete Progress & Reset App
            </button>
          </div>
        </div>
      </div>

      {/* Daily Workout Editor Panel - order-1 on mobile, lg:order-2 on desktop */}
      <div className="order-1 lg:order-2 lg:col-span-8 bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6 animate-fade-in relative">
        
        {/* Floating Success Feedback Toast */}
        {saveFeedback && (
          <div className="absolute top-4 right-4 bg-[#D4FF00] text-black text-xs font-black px-4 py-2 rounded-xl shadow-lg border border-[#D4FF00] z-50 animate-bounce">
            {saveFeedback}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#1A1A1A] pb-4">
          <div>
            <h3 className="font-bold text-white text-sm">Challenge Scheduler Manager</h3>
            <p className="text-xs text-[#888888]">Select any day of the 30-day program and customize its routine structure.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#888888]">Select Day:</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-[#222222] bg-[#111111] font-mono text-xs font-bold text-[#D4FF00] focus:outline-hidden focus:ring-1 focus:ring-[#D4FF00]"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>Day {day}</option>
              ))}
            </select>
          </div>
        </div>

        {editingPlan && (
          <div className="space-y-6">
            {/* Title & Restday config */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-1.5 font-mono">
                  Workout Session Title
                </label>
                <input
                  type="text"
                  value={editingPlan.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#222222] bg-[#111111] text-xs text-white font-bold focus:outline-hidden focus:ring-1 focus:ring-[#D4FF00]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#888888] uppercase tracking-wider mb-1.5 font-mono">
                  Day State Mode
                </label>
                <div className="flex items-center gap-3 h-10">
                  <button
                    onClick={() => handleFieldChange('isRestDay', false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      !editingPlan.isRestDay
                        ? 'bg-[#D4FF00]/10 border-[#D4FF00]/30 text-[#D4FF00]'
                        : 'border-[#222222] text-[#666666] hover:bg-[#111111]'
                    }`}
                  >
                    Active Workout
                  </button>
                  <button
                    onClick={() => handleFieldChange('isRestDay', true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      editingPlan.isRestDay
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'border-[#222222] text-[#666666] hover:bg-[#111111]'
                    }`}
                  >
                    Recovery Rest Day
                  </button>
                </div>
              </div>
            </div>

            {!editingPlan.isRestDay && (
              <>
                {/* Exercises editor */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                      Exercises Queue ({editingPlan.exercises.length})
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-[#888888] font-mono">
                      <span>Rest intervals:</span>
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={editingPlan.restBetweenSeconds}
                        onChange={(e) => handleFieldChange('restBetweenSeconds', parseInt(e.target.value) || 12)}
                        className="w-12 text-center bg-[#111111] border border-[#222222] rounded px-1.5 py-0.5 text-[10px] font-bold font-mono text-[#D4FF00] focus:outline-hidden focus:ring-1 focus:ring-[#D4FF00]"
                      />
                      <span>s</span>
                    </div>
                  </div>

                  {editingPlan.exercises.length === 0 ? (
                    <div className="text-center py-8 bg-[#111111] rounded-2xl text-[#666666] text-xs border border-[#222222]">
                      No exercises in this session. Add one below!
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {editingPlan.exercises.map((item, idx) => {
                        const libItem = EXERCISE_LIBRARY.find(e => e.id === item.exerciseId);
                        if (!libItem) return null;

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3 p-3 bg-[#111111] border border-[#222222] rounded-xl hover:border-[#333333] transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-[10px] font-mono font-bold text-[#666666] w-4">
                                {idx + 1}.
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">
                                  {libItem.name}
                                </p>
                                <p className="text-[10px] text-[#888888] flex items-center gap-1 font-mono">
                                  <Flame size={10} className="text-[#D4FF00]" />
                                  {libItem.targetGroup} • {Math.round(libItem.caloriesPerMinute * (item.durationSeconds / 60))} kcal est.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {/* Duration Input */}
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="5"
                                  max="300"
                                  value={item.durationSeconds}
                                  onChange={(e) => handleExerciseDurationChange(idx, parseInt(e.target.value) || 30)}
                                  className="w-14 text-center bg-[#0A0A0A] border border-[#222222] rounded px-1.5 py-1 text-xs font-bold font-mono text-white focus:outline-hidden"
                                />
                                <span className="text-[10px] font-mono text-[#666666]">s</span>
                              </div>

                              {/* Ordering & Delete */}
                              <div className="flex items-center gap-1 border-l border-[#222222] pl-3">
                                <button
                                  onClick={() => handleMoveExercise(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1 text-[#666666] hover:text-[#D4FF00] disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  onClick={() => handleMoveExercise(idx, 'down')}
                                  disabled={idx === editingPlan.exercises.length - 1}
                                  className="p-1 text-[#666666] hover:text-[#D4FF00] disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown size={14} />
                                </button>
                                <button
                                  onClick={() => handleRemoveExercise(idx)}
                                  className="p-1 text-[#666666] hover:text-red-500 cursor-pointer ml-1"
                                  title="Delete exercise"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add Exercise Segment */}
                  <div className="bg-[#111111] rounded-2xl p-3 border border-dashed border-[#222222] flex items-center justify-between gap-3 mt-4">
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono text-[#666666] shrink-0">Add exercise:</span>
                      <select
                        value={addingExId}
                        onChange={(e) => setAddingExId(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#222222] bg-[#0A0A0A] text-xs text-white"
                      >
                        {EXERCISE_LIBRARY.map(ex => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name} ({ex.targetGroup})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleAddExercise}
                      className="px-3.5 py-2 bg-[#D4FF00] hover:brightness-110 text-black rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer uppercase tracking-wide"
                    >
                      <Plus size={14} /> Add Queue
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit Day Plan Changes */}
            <div className="pt-4 border-t border-[#1A1A1A] flex justify-end">
              <button
                onClick={handleSaveDayPlan}
                className="py-2.5 px-6 bg-[#D4FF00] hover:brightness-110 text-black rounded-2xl font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wide shadow-[0_0_15px_rgba(212,255,0,0.2)]"
              >
                <Save size={14} /> Save Day {selectedDay} Configuration
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
