import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Video, Layers } from 'lucide-react';

interface VisualsProps {
  imageType: 'plank' | 'crunch' | 'raise' | 'twist' | 'kick' | 'climber' | 'heel' | 'stretch';
  isPlaying: boolean;
  exerciseId?: string;
}

const VIDEO_MAP: Record<string, string> = {
  crunch: 'MKmrqcoCZ-M',
  leg_raise: 'JB2oyawG9KI',
  russian_twist: 'wkD8rjkodUI',
  plank: 'pSHjTRCQxIw',
  flutter_kick: 'eS7Sg09M8-U',
  mountain_climber: 'zTfZY-y92T0',
  heel_touch: '9X27_P87b70',
  bicycle_crunch: 'Iwyvozckjak',
  reverse_crunch: 'gMyS72fSby4',
  cobra_stretch: 'JDdP9U7rS80',
};

const TYPE_VIDEO_MAP: Record<string, string> = {
  crunch: 'MKmrqcoCZ-M',
  raise: 'JB2oyawG9KI',
  twist: 'wkD8rjkodUI',
  plank: 'pSHjTRCQxIw',
  kick: 'eS7Sg09M8-U',
  climber: 'zTfZY-y92T0',
  heel: '9X27_P87b70',
  stretch: 'JDdP9U7rS80',
};

const CLIP_RANGES: Record<string, { start: number; end: number }> = {
  'MKmrqcoCZ-M': { start: 12, end: 16 },   // Crunch
  'JB2oyawG9KI': { start: 15, end: 19 },   // Leg Raise
  'wkD8rjkodUI': { start: 14, end: 18 },   // Russian Twist
  'pSHjTRCQxIw': { start: 11, end: 17 },   // Plank
  'eS7Sg09M8-U': { start: 12, end: 16 },   // Flutter Kick
  'zTfZY-y92T0': { start: 11, end: 15 },   // Mountain Climber
  '9X27_P87b70': { start: 15, end: 19 },   // Heel Touch
  'Iwyvozckjak': { start: 12, end: 16 },   // Bicycle Crunch
  'gMyS72fSby4': { start: 15, end: 19 },   // Reverse Crunch
  'JDdP9U7rS80': { start: 15, end: 21 },   // Cobra Stretch
};

const TARGET_MAP: Record<string, string> = {
  crunch: 'Upper Abs',
  raise: 'Lower Abs',
  twist: 'Obliques',
  plank: 'Core Strength',
  kick: 'Lower Abs',
  climber: 'Cardio Core',
  heel: 'Obliques',
  stretch: 'Recovery Stretch',
};

export const ExerciseVisuals: React.FC<VisualsProps> = ({ imageType, isPlaying, exerciseId }) => {
  const duration = isPlaying ? 1.5 : 0;
  const videoId = (exerciseId && VIDEO_MAP[exerciseId]) || TYPE_VIDEO_MAP[imageType];
  
  const [lastVideoId, setLastVideoId] = useState<string | undefined>(videoId);
  const [viewMode, setViewMode] = useState<'blueprint' | 'video'>(videoId ? 'video' : 'blueprint');
  const [loopKey, setLoopKey] = useState(0);

  if (videoId !== lastVideoId) {
    setLastVideoId(videoId);
    setViewMode(videoId ? 'video' : 'blueprint');
    setLoopKey(0);
  }

  const range = videoId ? CLIP_RANGES[videoId] || { start: 10, end: 15 } : { start: 10, end: 15 };

  // Render the animated skeletal figures based on exercise type
  const renderVisual = () => {
    switch (imageType) {
      case 'plank':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full max-h-56">
            {/* Ground */}
            <line x1="20" y1="90" x2="180" y2="90" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
            
            {/* Forearm */}
            <line x1="50" y1="90" x2="50" y2="70" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
            <line x1="50" y1="70" x2="70" y2="70" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
            
            {/* Body */}
            <motion.g
              animate={isPlaying ? { y: [0, -2, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              {/* Spine/Hip/Leg line of Plank */}
              <line x1="50" y1="70" x2="140" y2="70" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
              {/* Feet resting */}
              <line x1="140" y1="70" x2="145" y2="90" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
              {/* Head */}
              <circle cx="40" cy="65" r="10" fill="#1E293B" />
              {/* Energy Ring / Core Focus Indicator */}
              <motion.circle
                cx="90"
                cy="70"
                r="15"
                stroke="#60A5FA"
                strokeWidth="2"
                fill="none"
                animate={isPlaying ? { r: [12, 22, 12], opacity: [0.8, 0.1, 0.8] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.g>
          </svg>
        );

      case 'crunch':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full max-h-56">
            {/* Ground */}
            <line x1="20" y1="95" x2="180" y2="95" stroke="#CBD5E1" strokeWidth="4" />
            
            {/* Hips and Lower Legs (stationary) */}
            <path d="M 100,95 L 130,70 L 160,95" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Torso & Head (Animating) */}
            <motion.g
              animate={isPlaying ? { rotate: [0, -25, 0] } : {}}
              style={{ originX: '100px', originY: '95px' }}
              transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
            >
              {/* Spine */}
              <line x1="100" y1="95" x2="55" y2="80" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
              {/* Head */}
              <circle cx="45" cy="70" r="10" fill="#1E293B" />
              {/* Arms cradling head */}
              <path d="M 55,80 L 40,75 L 45,70" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* Glow core */}
              <motion.circle
                cx="85"
                cy="88"
                r="10"
                fill="#EF4444"
                animate={isPlaying ? { opacity: [0.2, 0.8, 0.2] } : { opacity: 0.3 }}
                transition={{ repeat: Infinity, duration }}
              />
            </motion.g>
          </svg>
        );

      case 'raise':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full max-h-56">
            {/* Ground */}
            <line x1="20" y1="95" x2="180" y2="95" stroke="#CBD5E1" strokeWidth="4" />
            
            {/* Torso, Head, Arms (Flat on ground) */}
            <line x1="110" y1="95" x2="50" y2="95" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
            <circle cx="40" cy="95" r="9" fill="#1E293B" />
            
            {/* Legs Raising */}
            <motion.g
              animate={isPlaying ? { rotate: [0, -75, 0] } : {}}
              style={{ originX: '110px', originY: '95px' }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              {/* Legs */}
              <line x1="110" y1="95" x2="175" y2="95" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
              {/* Feet */}
              <line x1="175" y1="95" x2="180" y2="85" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
            </motion.g>
            
            {/* Target Abs marker */}
            <motion.circle
              cx="100"
              cy="95"
              r="12"
              fill="#F59E0B"
              animate={isPlaying ? { scale: [0.8, 1.3, 0.8], opacity: [0.3, 0.8, 0.3] } : {}}
              transition={{ repeat: Infinity, duration: 1.8 }}
            />
          </svg>
        );

      case 'twist':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full max-h-56">
            {/* Ground */}
            <line x1="20" y1="100" x2="180" y2="100" stroke="#CBD5E1" strokeWidth="4" />
            
            {/* Legs bent in V-sit (fixed) */}
            <path d="M 100,80 L 135,50 L 160,65" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Upper body torso and head in V-sit, twisting side to side */}
            <motion.g
              animate={isPlaying ? { x: [-10, 10, -10], scaleY: [1, 0.95, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            >
              {/* Spine */}
              <line x1="100" y1="80" x2="70" y2="45" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
              {/* Head */}
              <circle cx="63" cy="35" r="9" fill="#1E293B" />
              {/* Hands holding clasp and moving */}
              <motion.circle
                cx={90}
                cy={55}
                r="6"
                fill="#EF4444"
                animate={isPlaying ? { x: [-15, 15, -15], y: [-5, 5, -5] } : {}}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              />
              <line x1="70" y1="45" x2="90" y2="55" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            </motion.g>
          </svg>
        );

      case 'kick':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full max-h-56">
            {/* Ground */}
            <line x1="20" y1="95" x2="180" y2="95" stroke="#CBD5E1" strokeWidth="4" />
            
            {/* Back flat */}
            <line x1="50" y1="95" x2="110" y2="95" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
            <circle cx="40" cy="90" r="9" fill="#1E293B" />
            
            {/* Leg 1 (Kick up and down) */}
            <motion.g
              animate={isPlaying ? { rotate: [-10, -35, -10] } : {}}
              style={{ originX: '110px', originY: '95px' }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            >
              <line x1="110" y1="95" x2="170" y2="90" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" />
            </motion.g>
            
            {/* Leg 2 (Opposite kick) */}
            <motion.g
              animate={isPlaying ? { rotate: [-30, -5, -30] } : {}}
              style={{ originX: '110px', originY: '95px' }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            >
              <line x1="110" y1="95" x2="170" y2="90" stroke="#93C5FD" strokeWidth="6" strokeLinecap="round" />
            </motion.g>
          </svg>
        );

      case 'climber':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full max-h-56">
            {/* Ground */}
            <line x1="20" y1="95" x2="180" y2="95" stroke="#CBD5E1" strokeWidth="4" />
            
            {/* Hands (Stationary in Plank) */}
            <line x1="70" y1="95" x2="70" y2="60" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
            
            {/* Main torso (Stationary in high plank) */}
            <line x1="70" y1="60" x2="150" y2="70" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />
            <circle cx="60" cy="53" r="10" fill="#1E293B" />
            
            {/* Alternating Knees driving in */}
            <motion.g
              animate={isPlaying ? { x: [0, -30, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            >
              {/* Running Knee */}
              <path d="M 150,70 L 120,80 L 100,75" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </motion.g>
            
            {/* Back resting foot */}
            <line x1="150" y1="70" x2="165" y2="95" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      case 'heel':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full max-h-56">
            {/* Ground */}
            <line x1="20" y1="100" x2="180" y2="100" stroke="#CBD5E1" strokeWidth="4" />
            
            {/* Heels and bent knees */}
            <circle cx="140" cy="90" r="5" fill="#1E293B" />
            <circle cx="150" cy="90" r="5" fill="#1E293B" />
            <path d="M 90,100 L 125,75 L 145,95" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Body sliding side to side */}
            <motion.g
              animate={isPlaying ? { x: [-15, 15, -15] } : {}}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            >
              {/* Spine slightly lifted */}
              <line x1="90" y1="100" x2="50" y2="85" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
              <circle cx="42" cy="75" r="9" fill="#1E293B" />
              {/* Hands reaching */}
              <line x1="50" y1="85" x2="110" y2="88" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
            </motion.g>
          </svg>
        );

      case 'stretch':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-full max-h-56">
            {/* Ground */}
            <line x1="20" y1="95" x2="180" y2="95" stroke="#CBD5E1" strokeWidth="4" />
            
            {/* Hips & Legs resting flat */}
            <line x1="100" y1="95" x2="170" y2="95" stroke="#1E293B" strokeWidth="7" strokeLinecap="round" />
            
            {/* Hands straight holding up */}
            <line x1="75" y1="95" x2="75" y2="60" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
            
            {/* Cobra Arch Upper body stretching (gentle breathing motion) */}
            <motion.g
              animate={isPlaying ? { y: [0, -3, 0], rotate: [0, -2, 0] } : {}}
              style={{ originX: '100px', originY: '95px' }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              {/* Arched Spine */}
              <path d="M 100,95 Q 85,75 75,55" stroke="#10B981" strokeWidth="8" strokeLinecap="round" fill="none" />
              {/* Head looking up */}
              <circle cx="78" cy="42" r="10" fill="#1E293B" />
            </motion.g>
          </svg>
        );

      default:
        return (
          <div className="w-full h-40 bg-slate-100 flex items-center justify-center rounded">
            <span className="text-slate-400">Exercise Preview</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-[#0A0A0A] border border-[#222222] rounded-3xl p-4 flex flex-col items-center justify-center shadow-inner relative overflow-hidden h-72">
      {viewMode === 'video' && videoId ? (
        <div className="w-full h-full relative rounded-2xl overflow-hidden bg-black flex items-center justify-center">
          <iframe
            key={`${videoId}-${loopKey}`}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=1&playlist=${videoId}&loop=1&controls=1&modestbranding=1&rel=0&showinfo=0&start=${range.start}&end=${range.end}`}
            title="Exercise demonstration"
            className="w-full h-full absolute inset-0 border-0 rounded-2xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center pt-8 pb-4">
          {renderVisual()}
        </div>
      )}

      {/* View Mode Switcher */}
      {videoId && (
        <div className="absolute top-3 left-3 z-10 flex gap-1 bg-[#111111]/90 backdrop-blur-md p-0.5 rounded-xl border border-[#222222] shadow-md">
          <button
            type="button"
            onClick={() => setViewMode('video')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'video'
                ? 'bg-[#D4FF00] text-black font-black'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Video size={10} /> Video
          </button>
          <button
            type="button"
            onClick={() => setViewMode('blueprint')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'blueprint'
                ? 'bg-[#D4FF00] text-black font-black'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Layers size={10} /> Blueprint
          </button>
        </div>
      )}

      {/* Interactive Muscle Group overlay */}
      <div className="absolute bottom-3 left-3 bg-[#111111]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider text-[#888888] border border-[#222222] shadow-xs z-10">
        Target: <span className="text-[#D4FF00] font-bold">{TARGET_MAP[imageType] || imageType}</span>
      </div>

      {isPlaying && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#111111]/90 backdrop-blur-md px-2 py-1 rounded-md border border-[#222222] z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4FF00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4FF00]"></span>
          </span>
          <span className="text-[9px] text-[#D4FF00] font-mono font-black tracking-wider">ACTIVE</span>
        </div>
      )}
    </div>
  );
};
