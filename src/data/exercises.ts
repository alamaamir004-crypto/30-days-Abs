import { Exercise } from '../types';

export const EXERCISE_LIBRARY: Exercise[] = [
  {
    id: 'crunch',
    name: 'Abdominal Crunch',
    description: 'A classic core movement targeting the rectus abdominis (upper abs).',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor.',
      'Place your hands gently behind your head or crossed over your chest.',
      'Engage your core, exhale, and lift your upper back off the ground.',
      'Hold for a brief second at the peak, then slowly lower down while inhaling.'
    ],
    durationSeconds: 60,
    caloriesPerMinute: 6,
    targetGroup: 'Upper Abs',
    imageType: 'crunch'
  },
  {
    id: 'leg_raise',
    name: 'Leg Raises',
    description: 'An effective exercise focusing on the lower rectus abdominis.',
    instructions: [
      'Lie flat on your back, legs straight, with arms resting by your sides.',
      'Place hands under your glutes for lower back support if needed.',
      'Keep your legs straight and lift them slowly until they point to the ceiling.',
      'Lower your legs slowly back toward the floor, keeping your lower back pressed down.'
    ],
    durationSeconds: 60,
    caloriesPerMinute: 5,
    targetGroup: 'Lower Abs',
    imageType: 'raise'
  },
  {
    id: 'russian_twist',
    name: 'Russian Twists',
    description: 'An excellent rotational exercise that sculpts the obliques.',
    instructions: [
      'Sit on the floor, bend your knees, and lift your feet slightly off the floor.',
      'Lean back slightly to form a V-shape with your thighs and torso.',
      'Clasp your hands together in front of your chest.',
      'Twist your torso to the right, then back to the left, tapping the floor on each side.'
    ],
    durationSeconds: 60,
    caloriesPerMinute: 7,
    targetGroup: 'Obliques',
    imageType: 'twist'
  },
  {
    id: 'plank',
    name: 'Forearm Plank',
    description: 'The ultimate isometric hold for whole-core stability and strength.',
    instructions: [
      'Place your forearms on the ground, elbows directly under your shoulders.',
      'Extend your legs straight behind you, toes tucked, lifting your hips.',
      'Form a straight line from your head to your heels.',
      'Hold the position while squeezing your glutes, abs, and thighs.'
    ],
    durationSeconds: 60,
    caloriesPerMinute: 4,
    targetGroup: 'Core',
    imageType: 'plank'
  },
  {
    id: 'flutter_kick',
    name: 'Flutter Kicks',
    description: 'A high-intensity lower abdominal toner that tests endurance.',
    instructions: [
      'Lie on your back, legs straight, hands under your hips for back support.',
      'Lift your head, neck, and shoulders slightly off the ground.',
      'Raise both legs about 6 inches off the floor.',
      'Rapidly kick your legs up and down in a small, controlled, alternating motion.'
    ],
    durationSeconds: 60,
    caloriesPerMinute: 8,
    targetGroup: 'Lower Abs',
    imageType: 'kick'
  },
  {
    id: 'mountain_climber',
    name: 'Mountain Climbers',
    description: 'A dynamic exercise that boosts heart rate while crushing the entire core.',
    instructions: [
      'Start in a push-up position with your hands directly under your shoulders.',
      'Keep your core tight and your body in a straight line.',
      'Drive your right knee toward your chest, then quickly return it to starting position.',
      'Immediately repeat the movement with your left knee, creating a running motion.'
    ],
    durationSeconds: 60,
    caloriesPerMinute: 9,
    targetGroup: 'Core',
    imageType: 'climber'
  },
  {
    id: 'heel_touch',
    name: 'Heel Touches',
    description: 'A side-to-side crunching movement targeting lateral obliques.',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor, hip-width apart.',
      'Rest your arms straight by your sides.',
      'Lift your chest slightly off the ground.',
      'Crunch sideways to the right to touch your right heel, then to the left for your left heel.'
    ],
    durationSeconds: 60,
    caloriesPerMinute: 5,
    targetGroup: 'Obliques',
    imageType: 'heel'
  },
  {
    id: 'bicycle_crunch',
    name: 'Bicycle Crunches',
    description: 'Consistently rated one of the most effective abdominal exercises.',
    instructions: [
      'Lie flat on your back, place your hands behind your head, elbows wide.',
      'Raise your legs, knees bent at 90 degrees.',
      'Exhale and bring your right elbow toward your left knee while extending the right leg.',
      'Alternate immediately by bringing your left elbow toward your right knee.'
    ],
    durationSeconds: 60,
    caloriesPerMinute: 8,
    targetGroup: 'Obliques',
    imageType: 'crunch'
  },
  {
    id: 'reverse_crunch',
    name: 'Reverse Crunches',
    description: 'Focuses on lifting the pelvis to crunch the lower abs.',
    instructions: [
      'Lie on your back, knees bent at 90 degrees, feet lifted in the air.',
      'Place your arms on the floor beside you, palms facing down.',
      'Engage your lower abs to pull your knees toward your chest and lift your tailbone.',
      'Slowly lower your hips back to the floor without letting your feet touch the ground.'
    ],
    durationSeconds: 60,
    caloriesPerMinute: 6,
    targetGroup: 'Lower Abs',
    imageType: 'crunch'
  },
  {
    id: 'cobra_stretch',
    name: 'Cobra Stretch',
    description: 'A perfect abdominal and spinal decompression stretch to close your session.',
    instructions: [
      'Lie face down on the floor with your hands under your shoulders.',
      'Gently push your upper body up, arching your back and lifting your chest.',
      'Keep your hips and legs resting flat on the ground.',
      'Hold the stretch, breathe deeply, and relax your core muscles.'
    ],
    durationSeconds: 60,
    caloriesPerMinute: 2,
    targetGroup: 'Core',
    imageType: 'stretch'
  }
];
