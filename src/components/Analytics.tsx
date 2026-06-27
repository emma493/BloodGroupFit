import { Flame, Clock, Heart, Trash2, Calendar, Award, ChevronLeft, CalendarDays } from 'lucide-react';
import { WorkoutLog } from '../types';

interface AnalyticsProps {
  logs: WorkoutLog[];
  onClearLogs: () => void;
  onBackToDashboard: () => void;
}

export default function Analytics({ logs, onClearLogs, onBackToDashboard }: AnalyticsProps) {
  // Calculations
  const totalMinutes = logs.reduce((acc, curr) => acc + curr.duration, 0);
  const totalCalories = logs.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  const totalSessions = logs.length;
  
  // Calculate average duration
  const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  // Streak Calculation (simplified based on continuous dates or count)
  // Let's count consecutive days or default to a smart calculation:
  const getStreak = () => {
    if (logs.length === 0) return 0;
    
    // Extract unique dates sorted in descending order
    const dates = Array.from(new Set(logs.map(log => log.date))).map(dStr => new Date(dStr));
    dates.sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0,0,0,0);
    
    const mostRecent = dates[0];
    mostRecent.setHours(0,0,0,0);
    
    // If the most recent workout is not today or yesterday, streak is broken
    if (mostRecent.getTime() !== today.getTime() && mostRecent.getTime() !== yesterday.getTime()) {
      return 0;
    }
    
    streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const current = dates[i];
      const next = dates[i+1];
      
      const diffTime = Math.abs(current.getTime() - next.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break; // Streak broken
      }
    }
    
    return streak;
  };

  const streakCount = getStreak();

  // SVG Chart data preparation (Max last 7 logs)
  const chartLogs = [...logs].reverse().slice(-7);
  const maxCalories = chartLogs.length > 0 ? Math.max(...chartLogs.map(l => l.caloriesBurned), 100) : 100;
  
  return (
    <div id="analytics-view" className="space-y-8 animate-fade-in py-6">
      {/* Header back navigation */}
      <div className="flex items-center justify-between">
        <button
          id="analytics-back-btn"
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="font-display text-2xl font-bold text-gray-950 dark:text-white">
          Health Tracker & Analytics
        </h1>

        {logs.length > 0 ? (
          <button
            id="analytics-clear-btn"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your workout history? This cannot be undone.")) {
                onClearLogs();
              }
            }}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 py-2 px-4 text-xs font-semibold dark:border-red-950/40 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset History</span>
          </button>
        ) : (
          <div className="w-24" />
        )}
      </div>

      {/* Bento Grid Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Streak */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Consistency Streak
            </span>
            <h3 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
              {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {streakCount > 0 ? 'Keep the fire burning!' : 'Start today to build a streak'}
            </p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            streakCount > 0 
              ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-400' 
              : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
          }`}>
            <Flame className={`h-6 w-6 ${streakCount > 0 ? 'animate-bounce' : ''}`} />
          </div>
        </div>

        {/* Total Calories */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Calories Burned
            </span>
            <h3 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
              {totalCalories} <span className="text-sm font-semibold text-gray-400">kcal</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Cumulative energetic output
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/30 dark:text-rose-400">
            <Heart className="h-6 w-6" />
          </div>
        </div>

        {/* Total Minutes */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Workout Volume
            </span>
            <h3 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
              {totalMinutes} <span className="text-sm font-semibold text-gray-400">mins</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total active session duration
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Accomplished Sessions */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Sessions
            </span>
            <h3 className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
              {totalSessions}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Avg duration: {avgDuration} mins
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-400">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      {logs.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2">
          {/* Chart 1: Calories Burned Progress (SVG Line Chart) */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-display text-sm font-bold text-gray-950 dark:text-white mb-4 flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-500" />
              <span>Calorie Burn Progress (Last {chartLogs.length} Sessions)</span>
            </h3>

            <div className="h-48 w-full relative">
              {/* Simple Responsive SVG Line Chart */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                {/* Horizontal reference gridlines */}
                <line x1="0" y1="30" x2="400" y2="30" className="stroke-gray-100 dark:stroke-gray-800/50" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="75" x2="400" y2="75" className="stroke-gray-100 dark:stroke-gray-800/50" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="120" x2="400" y2="120" className="stroke-gray-100 dark:stroke-gray-800/50" strokeWidth="1" strokeDasharray="4" />

                {chartLogs.length > 1 ? (
                  <>
                    {/* Continuous path line */}
                    <path
                      d={chartLogs.map((log, i) => {
                        const x = (i / (chartLogs.length - 1)) * 360 + 20;
                        // Map calories to y-axis (invert so larger calorie values are higher, i.e., lower y coordinate)
                        const y = 130 - (log.caloriesBurned / maxCalories) * 100;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')}
                      className="fill-none stroke-rose-500"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Gradient area beneath the line */}
                    <path
                      d={`${chartLogs.map((log, i) => {
                        const x = (i / (chartLogs.length - 1)) * 360 + 20;
                        const y = 130 - (log.caloriesBurned / maxCalories) * 100;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ')} L ${(chartLogs.length - 1) * (360 / (chartLogs.length - 1)) + 20} 130 L 20 130 Z`}
                      className="fill-rose-500/10 dark:fill-rose-500/5"
                    />

                    {/* Circular points */}
                    {chartLogs.map((log, i) => {
                      const x = (i / (chartLogs.length - 1)) * 360 + 20;
                      const y = 130 - (log.caloriesBurned / maxCalories) * 100;
                      return (
                        <g key={log.sessionId} className="group/dot">
                          <circle cx={x} cy={y} r="5" className="fill-rose-500 stroke-white dark:stroke-gray-900" strokeWidth="1.5" />
                          <circle cx={x} cy={y} r="8" className="fill-rose-500/20 opacity-0 group-hover/dot:opacity-100 transition-opacity cursor-pointer" />
                        </g>
                      );
                    })}
                  </>
                ) : (
                  // Solo point
                  <circle cx="200" cy="75" r="6" className="fill-rose-500 stroke-white" strokeWidth="2" />
                )}
              </svg>
            </div>

            {/* Labels under the chart */}
            <div className="mt-2 flex justify-between px-4 text-[10px] font-bold font-mono text-gray-400">
              {chartLogs.length > 0 ? (
                <>
                  <span>{chartLogs[0].date}</span>
                  {chartLogs.length > 1 && (
                    <span>{chartLogs[chartLogs.length - 1].date}</span>
                  )}
                </>
              ) : (
                <span>No logged data</span>
              )}
            </div>
          </div>

          {/* Chart 2: Active Duration Volumes (SVG Bar Chart) */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-display text-sm font-bold text-gray-950 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span>Minutes Spent (Last {chartLogs.length} Sessions)</span>
            </h3>

            <div className="h-48 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                {/* Reference lines */}
                <line x1="0" y1="30" x2="400" y2="30" className="stroke-gray-100 dark:stroke-gray-800/50" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="75" x2="400" y2="75" className="stroke-gray-100 dark:stroke-gray-800/50" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="120" x2="400" y2="120" className="stroke-gray-100 dark:stroke-gray-800/50" strokeWidth="1" strokeDasharray="4" />

                {/* Drawn bars */}
                {chartLogs.map((log, i) => {
                  const barWidth = 24;
                  const x = (i / Math.max(chartLogs.length - 1, 1)) * 340 + 20;
                  // Max minutes mapped is 45
                  const maxMins = 45;
                  const barHeight = (log.duration / maxMins) * 100;
                  const y = 130 - barHeight;

                  return (
                    <g key={log.sessionId}>
                      <rect
                        x={x - barWidth / 2}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx="5"
                        className="fill-emerald-500/80 hover:fill-emerald-500 transition-colors cursor-pointer"
                      />
                      <text
                        x={x}
                        y={y - 8}
                        textAnchor="middle"
                        className="text-[10px] font-mono font-bold fill-emerald-600 dark:fill-emerald-400"
                      >
                        {log.duration}m
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Labels under the chart */}
            <div className="mt-2 flex justify-between px-4 text-[10px] font-bold font-mono text-gray-400">
              {chartLogs.length > 0 ? (
                <>
                  <span>{chartLogs[0].date}</span>
                  {chartLogs.length > 1 && (
                    <span>{chartLogs[chartLogs.length - 1].date}</span>
                  )}
                </>
              ) : (
                <span>No logged data</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-200 p-12 text-center dark:border-gray-800">
          <CalendarDays className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-700" />
          <h3 className="mt-4 font-display text-lg font-bold text-gray-900 dark:text-white">
            No Workout Sessions Recorded Yet
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Once you play and complete an interactive workout session, your statistics, calories, and duration will automatically build charts here.
          </p>
          <button
            id="analytics-start-prompt-btn"
            onClick={onBackToDashboard}
            className="mt-6 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-600 transition-all cursor-pointer"
          >
            Go to Dashboard & Start Session
          </button>
        </div>
      )}

      {/* Workout logs list */}
      {logs.length > 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="font-display text-lg font-bold text-gray-950 dark:text-white mb-6">
            Detailed Exercise Log History
          </h3>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {[...logs].reverse().map((log) => (
              <div
                key={log.sessionId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-50 bg-gray-50/30 dark:border-gray-800 dark:bg-gray-950/20"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400 font-mono">
                      <Calendar className="h-3.5 w-3.5" />
                      {log.date}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {log.duration} minutes
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {log.exercisesCompleted.map((exName, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-lg bg-white border border-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300"
                      >
                        {exName}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Flame className="h-4.5 w-4.5 text-rose-500" />
                  <span className="text-sm font-extrabold text-gray-900 dark:text-white font-mono">
                    {log.caloriesBurned} kcal
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
