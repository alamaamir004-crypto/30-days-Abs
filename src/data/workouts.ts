import { DayPlan } from '../types';

export const THIRTY_DAYS_PLAN: DayPlan[] = [
  // Day 1
  {
    day: 1,
    title: 'Core Foundations',
    isRestDay: false,
    restBetweenSeconds: 15,
    exercises: [
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 2
  {
    day: 2,
    title: 'Lower Ab Activator',
    isRestDay: false,
    restBetweenSeconds: 15,
    exercises: [
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 3
  {
    day: 3,
    title: 'Oblique Sculptor',
    isRestDay: false,
    restBetweenSeconds: 15,
    exercises: [
      { exerciseId: 'russian_twist', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 4
  {
    day: 4,
    title: 'Cardio Core Spark',
    isRestDay: false,
    restBetweenSeconds: 15,
    exercises: [
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 5
  {
    day: 5,
    title: 'Muscle Recovery Day',
    isRestDay: true,
    restBetweenSeconds: 0,
    exercises: []
  },
  // Day 6
  {
    day: 6,
    title: 'Lower Ab & Oblique Shred',
    isRestDay: false,
    restBetweenSeconds: 15,
    exercises: [
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'russian_twist', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 7
  {
    day: 7,
    title: 'Belly Fat Burner',
    isRestDay: false,
    restBetweenSeconds: 15,
    exercises: [
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 8
  {
    day: 8,
    title: 'Deep Core Strengthener',
    isRestDay: false,
    restBetweenSeconds: 15,
    exercises: [
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'russian_twist', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 9
  {
    day: 9,
    title: 'Endurance Pioneer',
    isRestDay: false,
    restBetweenSeconds: 15,
    exercises: [
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 10
  {
    day: 10,
    title: 'Active Rest Day',
    isRestDay: true,
    restBetweenSeconds: 0,
    exercises: []
  },
  // Day 11
  {
    day: 11,
    title: 'The Plank Challenge',
    isRestDay: false,
    restBetweenSeconds: 12,
    exercises: [
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 12
  {
    day: 12,
    title: 'Lower Ab Dominator',
    isRestDay: false,
    restBetweenSeconds: 12,
    exercises: [
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 13
  {
    day: 13,
    title: 'Waist Slimmer',
    isRestDay: false,
    restBetweenSeconds: 12,
    exercises: [
      { exerciseId: 'russian_twist', durationSeconds: 60 },
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 14
  {
    day: 14,
    title: 'Total Core Overhaul',
    isRestDay: false,
    restBetweenSeconds: 12,
    exercises: [
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 15
  {
    day: 15,
    title: 'Midway Recovery',
    isRestDay: true,
    restBetweenSeconds: 0,
    exercises: []
  },
  // Day 16
  {
    day: 16,
    title: 'Advanced Shred Phase',
    isRestDay: false,
    restBetweenSeconds: 12,
    exercises: [
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'russian_twist', durationSeconds: 60 },
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 17
  {
    day: 17,
    title: 'Lower Ab Blast',
    isRestDay: false,
    restBetweenSeconds: 12,
    exercises: [
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 18
  {
    day: 18,
    title: 'Lateral Oblique Carver',
    isRestDay: false,
    restBetweenSeconds: 12,
    exercises: [
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'russian_twist', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 19
  {
    day: 19,
    title: 'V-Line Developer',
    isRestDay: false,
    restBetweenSeconds: 12,
    exercises: [
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'russian_twist', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 20
  {
    day: 20,
    title: 'Regeneration Day',
    isRestDay: true,
    restBetweenSeconds: 0,
    exercises: []
  },
  // Day 21
  {
    day: 21,
    title: 'Core Powerhouse',
    isRestDay: false,
    restBetweenSeconds: 10,
    exercises: [
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 22
  {
    day: 22,
    title: 'Lower Ab Tighter',
    isRestDay: false,
    restBetweenSeconds: 10,
    exercises: [
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 23
  {
    day: 23,
    title: 'Oblique Obliterator',
    isRestDay: false,
    restBetweenSeconds: 10,
    exercises: [
      { exerciseId: 'russian_twist', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 24
  {
    day: 24,
    title: 'Absolute Core Endurance',
    isRestDay: false,
    restBetweenSeconds: 10,
    exercises: [
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 25
  {
    day: 25,
    title: 'Decompression & Rest',
    isRestDay: true,
    restBetweenSeconds: 0,
    exercises: []
  },
  // Day 26
  {
    day: 26,
    title: 'Extreme Definition Routine',
    isRestDay: false,
    restBetweenSeconds: 10,
    exercises: [
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'russian_twist', durationSeconds: 60 },
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 27
  {
    day: 27,
    title: 'Iron Core Circuit',
    isRestDay: false,
    restBetweenSeconds: 10,
    exercises: [
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 28
  {
    day: 28,
    title: 'Fat Melter Extreme',
    isRestDay: false,
    restBetweenSeconds: 10,
    exercises: [
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'russian_twist', durationSeconds: 60 },
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 29
  {
    day: 29,
    title: 'Ultimate Pre-Champ Drill',
    isRestDay: false,
    restBetweenSeconds: 10,
    exercises: [
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'reverse_crunch', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  },
  // Day 30
  {
    day: 30,
    title: 'CHAMPIONSHIP CORE!',
    isRestDay: false,
    restBetweenSeconds: 10,
    exercises: [
      { exerciseId: 'plank', durationSeconds: 60 },
      { exerciseId: 'crunch', durationSeconds: 60 },
      { exerciseId: 'leg_raise', durationSeconds: 60 },
      { exerciseId: 'russian_twist', durationSeconds: 60 },
      { exerciseId: 'flutter_kick', durationSeconds: 60 },
      { exerciseId: 'mountain_climber', durationSeconds: 60 },
      { exerciseId: 'heel_touch', durationSeconds: 60 },
      { exerciseId: 'bicycle_crunch', durationSeconds: 60 },
      { exerciseId: 'cobra_stretch', durationSeconds: 60 }
    ]
  }
];
