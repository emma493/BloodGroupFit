import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Onboarding from './components/Onboarding';
import BloodGroupSelector from './components/BloodGroupSelector';
import CustomizerModal from './components/CustomizerModal';
import Dashboard from './components/Dashboard';
import WorkoutPlayer from './components/WorkoutPlayer';
import Analytics from './components/Analytics';
import { UserProfile, WorkoutLog, BloodGroup, Preferences } from './types';
import { generateWeeklySchedule } from './data';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics'>('dashboard');
  const [activeWorkoutExercises, setActiveWorkoutExercises] = useState<string[] | null>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize and load user from localStorage on mount
  useEffect(() => {
    const activeSessionStr = localStorage.getItem('bgf_active_session');
    if (activeSessionStr) {
      try {
        const sessionUser: UserProfile = JSON.parse(activeSessionStr);
        
        // Load latest profile from email-specific key (includes complete schedules, logs, etc.)
        const savedProfileStr = localStorage.getItem(`bgf_profile_${sessionUser.email}`);
        if (savedProfileStr) {
          const profile: UserProfile = JSON.parse(savedProfileStr);
          setUser(profile);
          applyTheme(profile.theme);
          
          // Load workout logs
          const savedLogsStr = localStorage.getItem(`bgf_logs_${profile.email}`);
          if (savedLogsStr) {
            setLogs(JSON.parse(savedLogsStr));
          }
        } else {
          // If no specific profile exists yet, use active session
          setUser(sessionUser);
          applyTheme(sessionUser.theme);
        }
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    } else {
      applyTheme('light'); // default theme
    }
    setIsInitialized(true);
  }, []);

  // Helper to handle visual theme swapping
  const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleOnboardComplete = (profile: UserProfile) => {
    // Check if there is an existing profile for this email
    const savedProfileStr = localStorage.getItem(`bgf_profile_${profile.email}`);
    let finalProfile = profile;
    
    if (savedProfileStr) {
      finalProfile = JSON.parse(savedProfileStr);
    } else {
      // Save initial profile
      localStorage.setItem(`bgf_profile_${profile.email}`, JSON.stringify(profile));
    }

    setUser(finalProfile);
    applyTheme(finalProfile.theme);

    // Load logs if any
    const savedLogsStr = localStorage.getItem(`bgf_logs_${finalProfile.email}`);
    if (savedLogsStr) {
      setLogs(JSON.parse(savedLogsStr));
    } else {
      setLogs([]);
    }
  };

  const handleSelectBloodGroup = (bloodGroup: BloodGroup) => {
    if (!user) return;
    
    const updated: UserProfile = { ...user, bloodGroup };
    setUser(updated);
    
    // Save to localStorage
    localStorage.setItem('bgf_active_session', JSON.stringify(updated));
    localStorage.setItem(`bgf_profile_${user.email}`, JSON.stringify(updated));
  };

  const handleCustomizerSubmit = (preferences: Preferences) => {
    if (!user) return;

    const schedule = generateWeeklySchedule(preferences);
    const updated: UserProfile = {
      ...user,
      preferences,
      weeklySchedule: schedule
    };

    setUser(updated);
    setShowCustomizer(false);

    // Save to localStorage
    localStorage.setItem('bgf_active_session', JSON.stringify(updated));
    localStorage.setItem(`bgf_profile_${user.email}`, JSON.stringify(updated));
  };

  const handleWorkoutComplete = (duration: number, calories: number, exercisesCompleted: string[]) => {
    if (!user) return;

    const newLog: WorkoutLog = {
      sessionId: `sess_${Date.now()}`,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      duration,
      caloriesBurned: calories,
      exercisesCompleted
    };

    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);

    // Mark today's workout as completed in the schedule if possible
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = dayNames[new Date().getDay()];
    
    let updatedUser = { ...user };
    if (updatedUser.weeklySchedule) {
      updatedUser.weeklySchedule = updatedUser.weeklySchedule.map((workout) => {
        if (workout.day === todayName) {
          return { ...workout, completed: true };
        }
        return workout;
      });
      setUser(updatedUser);
      localStorage.setItem('bgf_active_session', JSON.stringify(updatedUser));
      localStorage.setItem(`bgf_profile_${user.email}`, JSON.stringify(updatedUser));
    }

    // Save logs specifically for this user
    localStorage.setItem(`bgf_logs_${user.email}`, JSON.stringify(updatedLogs));
    
    // Stop active session play view
    setActiveWorkoutExercises(null);
    
    // Redirect to analytics to view logs & charts immediately!
    setCurrentView('analytics');
  };

  const handleThemeToggle = () => {
    const nextTheme = user?.theme === 'dark' ? 'light' : 'dark';
    
    applyTheme(nextTheme);

    if (user) {
      const updated: UserProfile = { ...user, theme: nextTheme };
      setUser(updated);
      localStorage.setItem('bgf_active_session', JSON.stringify(updated));
      localStorage.setItem(`bgf_profile_${user.email}`, JSON.stringify(updated));
    } else {
      // Temporary session theme when not logged in
      const tempProfile: any = JSON.parse(localStorage.getItem('bgf_active_session') || '{}');
      tempProfile.theme = nextTheme;
      localStorage.setItem('bgf_active_session', JSON.stringify(tempProfile));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bgf_active_session');
    setUser(null);
    setLogs([]);
    setCurrentView('dashboard');
    setActiveWorkoutExercises(null);
    applyTheme('light');
  };

  const handleClearLogs = () => {
    if (!user) return;
    setLogs([]);
    localStorage.removeItem(`bgf_logs_${user.email}`);
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto" />
          <p className="mt-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
            Initializing your biochemical profile...
          </p>
        </div>
      </div>
    );
  }

  // If active playing, render full-screen immersive workout player
  if (activeWorkoutExercises) {
    return (
      <WorkoutPlayer
        exerciseNames={activeWorkoutExercises}
        onComplete={handleWorkoutComplete}
        onClose={() => setActiveWorkoutExercises(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 dark:bg-gray-950 dark:text-gray-200 transition-colors duration-300">
      <Navbar
        user={user}
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
        onNavigate={setCurrentView}
        currentView={currentView}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!user ? (
          <Onboarding onOnboardComplete={handleOnboardComplete} />
        ) : !user.bloodGroup ? (
          <BloodGroupSelector onSelect={handleSelectBloodGroup} />
        ) : currentView === 'analytics' ? (
          <Analytics
            logs={logs}
            onClearLogs={handleClearLogs}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        ) : (
          <Dashboard
            user={user}
            onOptIn={() => setShowCustomizer(true)}
            onStartWorkout={setActiveWorkoutExercises}
            onUpdateBloodGroup={() => handleSelectBloodGroup(undefined as any)}
            onNavigateToAnalytics={() => setCurrentView('analytics')}
          />
        )}
      </main>

      {/* Multistep Workout Planner Customizer Modal */}
      {showCustomizer && (
        <CustomizerModal
          onClose={() => setShowCustomizer(false)}
          onSubmit={handleCustomizerSubmit}
          initialPreferences={user?.preferences}
        />
      )}
    </div>
  );
}
