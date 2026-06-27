import { useState } from 'react';
import { motion } from 'motion/react';
import { BloodGroup, UserProfile } from '../types';
import { BLOOD_GROUP_DATA } from '../data';
import { 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  TrendingUp, 
  Dumbbell, 
  Calendar, 
  RefreshCw, 
  Flame, 
  Heart,
  ChevronRight,
  Info
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  onOptIn: () => void;
  onStartWorkout: (exercises: string[]) => void;
  onUpdateBloodGroup: () => void;
  onNavigateToAnalytics: () => void;
}

export default function Dashboard({
  user,
  onOptIn,
  onStartWorkout,
  onUpdateBloodGroup,
  onNavigateToAnalytics
}: DashboardProps) {
  const [dietTab, setDietTab] = useState<'eat' | 'avoid'>('eat');
  const bloodData = BLOOD_GROUP_DATA[user.bloodGroup || 'O'];

  // Map today's name
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[new Date().getDay()];

  // Get current scheduled workout or default suggestions
  const todayWorkout = user.weeklySchedule?.find((w) => w.day === todayName);

  const handleStartTodayWorkout = () => {
    if (todayWorkout) {
      onStartWorkout(todayWorkout.exercises);
    } else {
      // Default standard workout exercises if not customized
      onStartWorkout(["Jumping Jacks", "Rest & Hydrate", "Bodyweight Squats", "Rest & Hydrate", "Forearm Plank Hold", "Rest & Hydrate", "Classic Push Ups"]);
    }
  };

  return (
    <div id="dashboard-view" className="space-y-8 animate-fade-in py-6">
      {/* Welcome Banner */}
      <div 
        id="dashboard-hero" 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white shadow-xl shadow-emerald-500/10"
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Blood Type {user.bloodGroup} Profile
          </span>
          <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back, {user.name}
          </h1>
          <p className="mt-2 text-sm text-emerald-50 leading-relaxed sm:text-base">
            Your biochemistry is unique. Based on the evolutionary patterns of Blood Type <strong className="underline">{user.bloodGroup}</strong>, we have prepared your tailored fitness and nutritional profile for today.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              id="dashboard-start-workout-btn"
              onClick={handleStartTodayWorkout}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-600 shadow-md hover:bg-emerald-50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Dumbbell className="h-4.5 w-4.5 text-emerald-500" />
              <span>Start Today's Workout</span>
            </button>
            <button
              id="dashboard-change-blood-btn"
              onClick={onUpdateBloodGroup}
              className="flex items-center gap-2 rounded-xl bg-black/20 px-5 py-3 text-sm font-bold text-white hover:bg-black/30 backdrop-blur-sm transition-all cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Change Blood Type</span>
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 hidden md:block w-1/3 opacity-15 pointer-events-none">
          <Heart className="h-full w-full stroke-[1px] p-8" />
        </div>
      </div>

      {/* Grid Layout for modules */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Diet Panel - Column Span 7 */}
        <div 
          id="diet-card" 
          className="lg:col-span-7 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
            <div>
              <h2 className="font-display text-xl font-bold text-gray-950 dark:text-white">
                Personalized Dietary Guide
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Biocompatible nutritional recommendations</p>
            </div>
            
            <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              <button
                id="diet-tab-eat"
                onClick={() => setDietTab('eat')}
                className={`rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  dietTab === 'eat'
                    ? 'bg-white text-emerald-600 shadow-sm dark:bg-gray-900 dark:text-emerald-400'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Foods to Eat
              </button>
              <button
                id="diet-tab-avoid"
                onClick={() => setDietTab('avoid')}
                className={`rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  dietTab === 'avoid'
                    ? 'bg-white text-red-600 shadow-sm dark:bg-gray-900 dark:text-red-400'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Foods to Avoid
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-4 text-xs text-gray-500 leading-relaxed dark:text-gray-400 p-4 rounded-2xl bg-gray-50 dark:bg-gray-950/50 flex items-start gap-2">
              <Info className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{bloodData.reason}</span>
            </div>

            {dietTab === 'eat' ? (
              <div className="space-y-4">
                {bloodData.eat.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {cat.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {bloodData.avoid.map((cat) => (
                  <div key={cat.category} className="rounded-xl border border-red-50 p-4 dark:border-red-950/20 bg-red-50/5 dark:bg-red-950/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">
                      {cat.category}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                      {cat.reason}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 rounded-full bg-red-50/50 px-3.5 py-1.5 text-xs font-medium text-red-700 dark:bg-red-950/20 dark:text-red-400"
                        >
                          <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action/Tip Rails - Column Span 5 */}
        <div className="lg:col-span-5 space-y-8">
          {/* Custom Exercises Opt-In */}
          <div 
            id="exercise-opt-in-card" 
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400">
                <Dumbbell className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                {user.weeklySchedule ? 'Tailored Active' : 'Basic Suggestion'}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="font-display text-lg font-bold text-gray-950 dark:text-white">
                Daily Exercise Guidance
              </h3>
              
              {!user.weeklySchedule ? (
                <>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Default Type {user.bloodGroup} recommendation: <strong className="text-emerald-600 dark:text-emerald-400">{bloodData.generalExercise}</strong>.
                  </p>
                  <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                    Build a complete weekly exercise schedule personalized to your fitness goal, experience, available equipment, and preferred activity!
                  </p>
                  <button
                    id="opt-in-exercise-btn"
                    onClick={onOptIn}
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 px-4 font-display text-sm font-bold text-white shadow-md hover:bg-emerald-600 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Opt-In for Custom Daily Exercises</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="mt-3 space-y-3">
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-950/50">
                    <p className="text-xs text-gray-400 font-semibold font-mono uppercase tracking-wider">
                      Today ({todayName})
                    </p>
                    <h4 className="font-display font-bold text-gray-950 dark:text-white mt-1">
                      {todayWorkout?.type || 'Rest Day'}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      {todayWorkout?.duration} mins • {todayWorkout?.exercises.length} exercises
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      id="opt-in-reconfigure-btn"
                      onClick={onOptIn}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Adjust Routine</span>
                    </button>
                    <button
                      id="opt-in-start-today-btn"
                      onClick={handleStartTodayWorkout}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 px-4 text-xs font-bold text-white hover:bg-emerald-600 transition-all cursor-pointer"
                    >
                      <Flame className="h-4.5 w-4.5 animate-pulse" />
                      <span>Start Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Health Best Practices */}
          <div 
            id="lifestyle-tips-card" 
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400">
              <Heart className="h-5 w-5" />
            </div>
            <div className="mt-4">
              <h3 className="font-display text-lg font-bold text-gray-950 dark:text-white">
                Best Health Practices
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Type {user.bloodGroup} biological alignment tips</p>
              
              <ul className="mt-4 space-y-3">
                {bloodData.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xs font-bold text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Planner Grid if Opted In */}
      {user.weeklySchedule && (
        <div 
          id="weekly-schedule-card" 
          className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors duration-300"
        >
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
            <Calendar className="h-5 w-5 text-emerald-500" />
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                Your Weekly Exercise Schedule
              </h3>
              <p className="text-xs text-gray-400">Tailored according to your fitness preference profile</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
            {user.weeklySchedule.map((workout, idx) => {
              const isToday = workout.day === todayName;
              return (
                <div
                  key={workout.day}
                  className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
                    isToday
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-md ring-2 ring-emerald-500/10'
                      : 'border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 font-mono">
                        {workout.day}
                      </span>
                      {isToday && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </div>
                    <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white mt-2 leading-snug">
                      {workout.type}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {workout.duration} mins • {workout.exercises.length} moves
                    </p>
                  </div>

                  <button
                    id={`start-workout-btn-${workout.day.toLowerCase()}`}
                    onClick={() => onStartWorkout(workout.exercises)}
                    className={`mt-4 w-full rounded-lg py-1.5 text-center text-xs font-bold transition-all cursor-pointer ${
                      isToday
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    Start
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analytics shortcut */}
      <div 
        id="analytics-shortcut-banner" 
        onClick={onNavigateToAnalytics}
        className="flex items-center justify-between cursor-pointer rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-950/20 hover:bg-gray-50 dark:hover:bg-gray-950/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-gray-900 dark:text-white">
              View Advanced Health Tracker & Analytics
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Analyze your streaks, total completed workout minutes, and custom calorie tracking
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}
