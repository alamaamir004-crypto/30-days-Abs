import React, { useState } from 'react';
import { GlassWater, Plus, Minus, Scale, Flame, Apple, Sparkles, Trash2, Calendar } from 'lucide-react';
import { UserProgress } from '../types';

interface ExtraFeaturesProps {
  progress: UserProgress;
  onUpdateWater: (glasses: number) => void;
  onAddWeight: (weight: number) => void;
  onDeleteWeight: (index: number) => void;
}

const NUTRITION_TIPS = [
  {
    title: "Abs are Made in the Kitchen",
    content: "No amount of training can override a calorie surplus. To see abdominal definition, focus on a clean diet with a moderate calorie deficit to lower your body fat percentage.",
    tag: "Rule #1"
  },
  {
    title: "Prioritize Lean Protein",
    content: "Consuming adequate protein (chicken breast, fish, tofu, eggs) boosts metabolism, increases satiety, and helps repair muscle fibers micro-torn during ab training.",
    tag: "Nutrition"
  },
  {
    title: "Reduce Sodium to Beat Bloat",
    content: "High sodium intake causes your body to hold excess water beneath the skin, masking abdominal definition. Keep processed food to a minimum and drink ample water.",
    tag: "Bloat Remedy"
  },
  {
    title: "The Importance of Hydration",
    content: "Water is crucial for fat metabolism (lipolysis). Drinking cold water can also slightly boost your resting metabolic rate. Aim for 8-12 glasses daily.",
    tag: "Hydration"
  },
  {
    title: "Don't Skip Healthy Fats",
    content: "Avocados, nuts, olive oil, and salmon support hormone production (like testosterone) which helps with muscle retention and fat burning.",
    tag: "Fat Loss"
  },
  {
    title: "Focus on Fiber",
    content: "High-fiber foods (vegetables, oats, berries) improve gut health and reduce abdominal bloating, leading to a flatter, healthier midsection.",
    tag: "Digestion"
  },
  {
    title: "Limit Liquid Calories",
    content: "Sugary sodas, energy drinks, and alcohol are packed with empty calories that promote visceral fat storage (the fat that wraps around your organs and covers abs).",
    tag: "Avoidance"
  }
];

export const ExtraFeatures: React.FC<ExtraFeaturesProps> = ({
  progress,
  onUpdateWater,
  onAddWeight,
  onDeleteWeight
}) => {
  const [weightInput, setWeightInput] = useState('');
  const todayDate = new Date().toISOString().split('T')[0];
  const todayWater = progress.waterLog[todayDate] || 0;

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weightInput);
    if (!isNaN(weightNum) && weightNum > 0) {
      onAddWeight(weightNum);
      setWeightInput('');
    }
  };

  // Get active tip based on day of month
  const tipIndex = new Date().getDate() % NUTRITION_TIPS.length;
  const currentTip = NUTRITION_TIPS[tipIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      {/* Hydration Log */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#111111] border border-[#222222] rounded-xl text-[#D4FF00]">
                <GlassWater size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Hydration Manager</h3>
                <p className="text-xs text-[#666666] font-mono">{todayDate}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-[#D4FF00]/10 border border-[#D4FF00]/20 text-[#D4FF00] px-2 py-1 rounded-md">
              {todayWater} / 8 Glass
            </span>
          </div>

          <p className="text-xs text-[#888888] mb-6">
            Hydration accelerates cellular recovery and reduces bloating. Log your water consumption below.
          </p>

          {/* Water animation visual */}
          <div className="relative w-full bg-[#111111] rounded-2xl h-24 overflow-hidden flex items-center justify-center border border-[#222222] mb-6">
            <div 
              className="absolute bottom-0 left-0 right-0 bg-[#D4FF00]/10 transition-all duration-500 ease-out" 
              style={{ height: `${Math.min((todayWater / 8) * 100, 100)}%` }}
            />
            {todayWater >= 8 ? (
              <div className="z-10 text-center">
                <p className="text-xs font-bold text-[#D4FF00] flex items-center gap-1 justify-center">
                  <Sparkles size={14} /> Target Achieved!
                </p>
                <p className="text-[10px] text-[#888888] mt-0.5">Your body is fully hydrated today.</p>
              </div>
            ) : (
              <div className="z-10 text-center">
                <p className="text-lg font-bold text-white">
                  {Math.round((todayWater / 8) * 100)}%
                </p>
                <p className="text-[10px] text-[#666666] font-mono">{(8 - todayWater)} glasses remaining</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onUpdateWater(Math.max(0, todayWater - 1))}
            disabled={todayWater === 0}
            className="flex-1 py-3 px-4 bg-[#111111] hover:bg-[#1A1A1A] disabled:opacity-30 text-[#E0E0E0] rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-[#222222] cursor-pointer"
          >
            <Minus size={14} /> Remove 1
          </button>
          <button
            onClick={() => onUpdateWater(todayWater + 1)}
            className="flex-1 py-3 px-4 bg-[#D4FF00] hover:brightness-110 text-black rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(212,255,0,0.15)]"
          >
            <Plus size={14} /> Add Glass
          </button>
        </div>
      </div>

      {/* Weight Tracker */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#111111] border border-[#222222] rounded-xl text-[#D4FF00]">
                <Scale size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Weight Progress</h3>
                <p className="text-xs text-[#666666]">Track body mass index</p>
              </div>
            </div>
            {progress.weightHistory.length > 0 && (
              <span className="text-xs font-mono font-bold bg-[#D4FF00]/10 border border-[#D4FF00]/20 text-[#D4FF00] px-2 py-1 rounded-md">
                Last: {progress.weightHistory[progress.weightHistory.length - 1].weight} kg
              </span>
            )}
          </div>

          <form onSubmit={handleAddWeight} className="flex gap-2 mb-4">
            <input
              type="number"
              step="0.1"
              required
              placeholder="e.g. 74.5"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-[#222222] bg-[#111111] text-white text-xs focus:ring-1 focus:ring-[#D4FF00] focus:outline-hidden font-mono"
            />
            <button
              type="submit"
              className="px-4 bg-[#D4FF00] hover:brightness-110 text-black rounded-2xl font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1"
            >
              Log
            </button>
          </form>

          {/* Historical Log */}
          <div className="max-h-28 overflow-y-auto pr-1 space-y-2 font-mono scrollbar-thin">
            {progress.weightHistory.length === 0 ? (
              <div className="text-center py-6 text-[#666666] text-[11px]">
                No weights logged yet.
              </div>
            ) : (
              progress.weightHistory.slice().reverse().map((w, idx) => {
                const originalIndex = progress.weightHistory.length - 1 - idx;
                return (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-[#888888] py-1.5 px-2.5 bg-[#111111] rounded-xl border border-[#222222]">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#666666]" />
                      {w.date}
                    </span>
                    <span className="font-bold text-white">{w.weight} kg</span>
                    <button
                      onClick={() => onDeleteWeight(originalIndex)}
                      className="text-[#666666] hover:text-[#FF5555] transition-colors p-0.5 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#1A1A1A] flex items-center gap-2 text-[#666666] text-[10px]">
          <Flame size={12} className="text-[#D4FF00]" />
          <span>Keep logs frequent to generate correct progressive slopes.</span>
        </div>
      </div>

      {/* Dynamic Health Tips */}
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-[#111111] border border-[#222222] rounded-xl text-[#D4FF00]">
              <Apple size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Abs Nutrition Tip</h3>
              <p className="text-xs text-[#666666]">Diet insights for core growth</p>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-4">
            <span className="text-[10px] font-bold font-mono tracking-wider text-black bg-[#D4FF00] px-2 py-0.5 rounded-full uppercase">
              {currentTip.tag}
            </span>
            <h4 className="font-bold text-white text-xs mt-2.5 mb-1.5">
              {currentTip.title}
            </h4>
            <p className="text-[11px] leading-relaxed text-[#888888]">
              {currentTip.content}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[#D4FF00] font-semibold text-xs">
          <Sparkles size={14} className="animate-pulse" />
          <span>Tips cycle daily with calendar dates!</span>
        </div>
      </div>

    </div>
  );
};
