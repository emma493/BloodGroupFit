export type BloodGroup = 'A' | 'B' | 'AB' | 'O';

export interface Preferences {
  goal: 'Lose Weight' | 'Build Muscle' | 'Improve Flexibility' | 'Overall Toning';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: 15 | 30 | 45; // in minutes
  equipment: ('None' | 'Dumbbells' | 'Resistance Bands' | 'Yoga Mat')[];
  workoutType: 'Yoga' | 'HIIT' | 'Strength Training' | 'Pilates' | 'Cardio';
}

export interface ScheduledWorkout {
  day: string; // e.g. "Monday"
  type: string; // e.g. "HIIT Cardiorespiratory"
  duration: number; // in minutes
  exercises: string[]; // exercise names
  completed: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  bloodGroup?: BloodGroup;
  preferences?: Preferences;
  weeklySchedule?: ScheduledWorkout[];
  theme: 'light' | 'dark';
}

export interface WorkoutLog {
  sessionId: string;
  date: string; // e.g., "6/27/2026"
  timestamp: number; // ms timestamp
  duration: number; // minutes
  caloriesBurned: number;
  exercisesCompleted: string[];
}

export type AnimationType = 'squats' | 'plank' | 'jumping-jacks' | 'pushups' | 'yoga-tree' | 'rest';

export interface Exercise {
  id: string;
  name: string;
  duration: number; // default duration in seconds for player loop
  caloriesPerMin: number;
  animationType: AnimationType;
  description: string;
}

export interface BloodGroupDiet {
  eat: { category: string; items: string[] }[];
  avoid: { category: string; items: string[]; reason: string }[];
  reason: string;
  generalExercise: string;
  tips: string[];
}
