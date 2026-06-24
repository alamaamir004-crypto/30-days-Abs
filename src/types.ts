export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  durationSeconds: number; // default duration
  caloriesPerMinute: number;
  targetGroup: 'Upper Abs' | 'Lower Abs' | 'Obliques' | 'Core';
  imageType: 'plank' | 'crunch' | 'raise' | 'twist' | 'kick' | 'climber' | 'heel' | 'stretch';
}

export interface DayPlan {
  day: number;
  title: string;
  exercises: {
    exerciseId: string;
    durationSeconds: number;
    reps?: number;
  }[];
  restBetweenSeconds: number;
  isRestDay: boolean;
}

export interface WorkoutHistory {
  date: string; // YYYY-MM-DD
  dayCompleted: number;
  durationSeconds: number;
  caloriesBurned: number;
}

export interface UserProgress {
  completedDays: number[]; // List of day numbers, e.g., [1, 2]
  streak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  history: WorkoutHistory[];
  waterLog: { [date: string]: number }; // date -> glasses of water
  weightHistory: { date: string; weight: number }[];
}

export interface AppSettings {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  defaultRestDuration: number;
  countdownDuration: number;
  humStyle?: 'none' | 'zen' | 'rhythmic' | 'vibe';
}
