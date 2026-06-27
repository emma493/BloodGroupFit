import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, X, Music, Music2, Volume2, VolumeX, Flame } from 'lucide-react';
import { EXERCISE_LIBRARY, soundscape } from '../data';
import { Exercise } from '../types';

interface WorkoutPlayerProps {
  exerciseNames: string[];
  onComplete: (durationMinutes: number, caloriesBurned: number, exercisesCompleted: string[]) => void;
  onClose: () => void;
}

export default function WorkoutPlayer({ exerciseNames, onComplete, onClose }: WorkoutPlayerProps) {
  // Map exercise names to actual Exercise objects from the library, fallback to custom if needed
  const sessionExercises: Exercise[] = exerciseNames.map((name, idx) => {
    const libraryEx = EXERCISE_LIBRARY.find((e) => e.name.toLowerCase() === name.toLowerCase());
    if (libraryEx) {
      return { ...libraryEx, id: `${libraryEx.id}_${idx}` };
    }
    // Dynamic fallback
    return {
      id: `ex_dynamic_${idx}`,
      name,
      duration: name.toLowerCase().includes('rest') ? 15 : 45,
      caloriesPerMin: name.toLowerCase().includes('rest') ? 1.5 : 8,
      animationType: name.toLowerCase().includes('rest')
        ? 'rest'
        : name.toLowerCase().includes('yoga') || name.toLowerCase().includes('stretch')
        ? 'yoga-tree'
        : 'squats',
      description: 'Perform this active movement focusing on clean, steady execution.'
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(sessionExercises[0]?.duration || 30);
  const [isPaused, setIsPaused] = useState(false);
  const [synthActive, setSynthActive] = useState(false);
  
  // Track total duration and calories dynamically
  const caloriesAccumulated = useRef(0);
  const durationAccumulated = useRef(0); // in seconds
  const completedNames = useRef<string[]>([]);

  const currentExercise = sessionExercises[currentIndex];

  // Synth controls
  const handleToggleSynth = () => {
    if (synthActive) {
      soundscape.stop();
      setSynthActive(false);
    } else {
      soundscape.start();
      setSynthActive(true);
    }
  };

  // Synthesize beep using web audio API to warn countdown end
  const playBeep = (freq: number, duration: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  // Main countdown timer logic
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleNextExercise();
          return 0;
        }
        if (prev === 4 || prev === 3 || prev === 2) {
          playBeep(440, 0.15); // low warn beeps
        }
        
        // Track stats
        durationAccumulated.current += 1;
        caloriesAccumulated.current += (currentExercise.caloriesPerMin / 60);

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  // Clean up synthesizer audio on close
  useEffect(() => {
    return () => {
      soundscape.stop();
    };
  }, []);

  const handleNextExercise = () => {
    // Save current completed exercise name if it's not rest
    if (currentExercise && !currentExercise.name.toLowerCase().includes('rest')) {
      if (!completedNames.current.includes(currentExercise.name)) {
        completedNames.current.push(currentExercise.name);
      }
    }

    playBeep(880, 0.45); // high completion chime

    if (currentIndex < sessionExercises.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeLeft(sessionExercises[nextIdx].duration);
    } else {
      // Workout Completed!
      handleWorkoutComplete();
    }
  };

  const handleSkip = () => {
    handleNextExercise();
  };

  const handleWorkoutComplete = () => {
    soundscape.stop();
    const finalMinutes = Math.max(1, Math.round(durationAccumulated.current / 60));
    const finalCalories = Math.round(caloriesAccumulated.current);
    // Ensure we have at least 1 completed exercise name
    if (completedNames.current.length === 0) {
      completedNames.current.push(currentExercise?.name || "Daily Session");
    }
    onComplete(finalMinutes, finalCalories, completedNames.current);
  };

  // Progress calculations
  const totalDuration = sessionExercises.reduce((acc, curr) => acc + curr.duration, 0);
  const currentProgressSeconds = sessionExercises.slice(0, currentIndex).reduce((acc, curr) => acc + curr.duration, 0) + (currentExercise.duration - timeLeft);
  const overallPercentage = Math.round((currentProgressSeconds / totalDuration) * 100);

  // SVG Custom Animated Humanoid based on the animationType
  const renderHumanoid = () => {
    const animation = currentExercise.animationType;

    let humanoidStyle = {};
    let leftLegStyle = {};
    let rightLegStyle = {};
    let leftArmStyle = {};
    let rightArmStyle = {};
    let headStyle = {};
    let torsoStyle = {};

    if (animation === 'jumping-jacks') {
      // Arms waving up/down, legs jumping wide/narrow
      return (
        <svg viewBox="0 0 100 120" className="h-full w-full max-h-48">
          <style>{`
            @keyframes headBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
            @keyframes torsoJacks { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(2px); } }
            @keyframes lArmJacks { 0%, 100% { transform: rotate(20deg); } 50% { transform: rotate(-130deg); } }
            @keyframes rArmJacks { 0%, 100% { transform: rotate(-20deg); } 50% { transform: rotate(130deg); } }
            @keyframes lLegJacks { 0%, 100% { transform: rotate(10deg); } 50% { transform: rotate(-25deg); } }
            @keyframes rLegJacks { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(25deg); } }
          `}</style>
          
          <g className="origin-center" style={{ transformOrigin: '50px 60px' }}>
            {/* Head */}
            <circle cx="50" cy="25" r="8" className="fill-emerald-400 dark:fill-emerald-300" style={{ animation: 'headBounce 1s infinite ease-in-out' }} />
            
            {/* Torso */}
            <line x1="50" y1="33" x2="50" y2="65" className="stroke-emerald-500 dark:stroke-emerald-400 stroke-[5] stroke-round" style={{ animation: 'torsoJacks 1s infinite ease-in-out' }} />
            
            {/* Left Arm */}
            <g style={{ transformOrigin: '48px 36px', animation: 'lArmJacks 1s infinite ease-in-out' }}>
              <line x1="48" y1="36" x2="25" y2="45" className="stroke-emerald-500 dark:stroke-emerald-400 stroke-[4.5] stroke-round" />
            </g>

            {/* Right Arm */}
            <g style={{ transformOrigin: '52px 36px', animation: 'rArmJacks 1s infinite ease-in-out' }}>
              <line x1="52" y1="36" x2="75" y2="45" className="stroke-emerald-500 dark:stroke-emerald-400 stroke-[4.5] stroke-round" />
            </g>

            {/* Left Leg */}
            <g style={{ transformOrigin: '50px 63px', animation: 'lLegJacks 1s infinite ease-in-out' }}>
              <line x1="50" y1="63" x2="35" y2="95" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[5] stroke-round" />
            </g>

            {/* Right Leg */}
            <g style={{ transformOrigin: '50px 63px', animation: 'rLegJacks 1s infinite ease-in-out' }}>
              <line x1="50" y1="63" x2="65" y2="95" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[5] stroke-round" />
            </g>

            {/* Ground indicator */}
            <ellipse cx="50" cy="110" rx="35" ry="4" className="fill-gray-200/50 dark:fill-gray-800/50" />
          </g>
        </svg>
      );
    }

    if (animation === 'squats') {
      // Body moves up and down, bending legs
      return (
        <svg viewBox="0 0 100 120" className="h-full w-full max-h-48">
          <style>{`
            @keyframes squatMove {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(22px) scaleY(0.85); }
            }
            @keyframes squatArm {
              0%, 100% { transform: rotate(15deg); }
              50% { transform: rotate(-75deg); }
            }
          `}</style>
          
          {/* Static Ground */}
          <ellipse cx="50" cy="110" rx="30" ry="4" className="fill-gray-200/50 dark:fill-gray-800/50" />

          {/* Squatting Core */}
          <g style={{ transformOrigin: '50px 110px', animation: 'squatMove 2s infinite ease-in-out' }}>
            {/* Head */}
            <circle cx="50" cy="20" r="8" className="fill-emerald-400 dark:fill-emerald-300" />
            
            {/* Torso */}
            <line x1="50" y1="28" x2="50" y2="60" className="stroke-emerald-500 dark:stroke-emerald-400 stroke-[5] stroke-round" />
            
            {/* Arms extended front */}
            <g style={{ transformOrigin: '50px 32px', animation: 'squatArm 2s infinite ease-in-out' }}>
              <line x1="50" y1="32" x2="25" y2="32" className="stroke-emerald-500 dark:stroke-emerald-400 stroke-[4.5] stroke-round" />
            </g>

            {/* Legs bending - drawn as a simple bent link */}
            <line x1="50" y1="60" x2="35" y2="82" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[5] stroke-round" />
            <line x1="35" y1="82" x2="35" y2="105" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[5] stroke-round" />

            <line x1="50" y1="60" x2="65" y2="82" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[5] stroke-round" />
            <line x1="65" y1="82" x2="65" y2="105" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[5] stroke-round" />
          </g>
        </svg>
      );
    }

    if (animation === 'plank') {
      // Horizontal posture, subtle core vibration / breathing rise
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full max-h-48">
          <style>{`
            @keyframes plankHold {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(1.5px); }
            }
          `}</style>
          
          <g style={{ animation: 'plankHold 1.5s infinite ease-in-out' }}>
            {/* Head (facing down) */}
            <circle cx="95" cy="40" r="7.5" className="fill-emerald-400 dark:fill-emerald-300" />
            
            {/* Straight Torso/Body line */}
            <line x1="20" y1="46" x2="88" y2="44" className="stroke-emerald-500 dark:stroke-emerald-400 stroke-[5.5] stroke-round" />
            
            {/* Supporting Forearms */}
            <line x1="82" y1="44" x2="84" y2="62" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[4.5] stroke-round" />
            <line x1="84" y1="62" x2="94" y2="62" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[4.5] stroke-round" />

            {/* Rear toes holding weight */}
            <line x1="20" y1="46" x2="20" y2="62" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[4.5] stroke-round" />

            {/* Ground */}
            <line x1="10" y1="63" x2="110" y2="63" className="stroke-gray-200 dark:stroke-gray-800 stroke-[2] stroke-round" />
          </g>
        </svg>
      );
    }

    if (animation === 'pushups') {
      // Horizontal posture, body lowering and lifting
      return (
        <svg viewBox="0 0 120 80" className="h-full w-full max-h-48">
          <style>{`
            @keyframes pushupBody {
              0%, 100% { transform: rotate(0deg) translateY(0); }
              50% { transform: rotate(4deg) translateY(12px); }
            }
          `}</style>
          
          {/* Ground */}
          <line x1="10" y1="63" x2="110" y2="63" className="stroke-gray-200 dark:stroke-gray-800 stroke-[2] stroke-round" />

          {/* Lowering group */}
          <g style={{ transformOrigin: '20px 62px', animation: 'pushupBody 2.2s infinite ease-in-out' }}>
            {/* Head */}
            <circle cx="95" cy="38" r="7.5" className="fill-emerald-400 dark:fill-emerald-300" />
            
            {/* Body */}
            <line x1="20" y1="44" x2="88" y2="42" className="stroke-emerald-500 dark:stroke-emerald-400 stroke-[5.5] stroke-round" />
            
            {/* Hands/Arms flexing */}
            <line x1="80" y1="42" x2="80" y2="62" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[4.5] stroke-round" />

            {/* Toes support */}
            <line x1="20" y1="44" x2="20" y2="62" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[4.5] stroke-round" />
          </g>
        </svg>
      );
    }

    if (animation === 'yoga-tree') {
      // Balanced static posture, gentle breathing sway
      return (
        <svg viewBox="0 0 100 120" className="h-full w-full max-h-48">
          <style>{`
            @keyframes treeSway {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(1deg); }
            }
          `}</style>
          
          <g style={{ transformOrigin: '50px 105px', animation: 'treeSway 4s infinite ease-in-out' }}>
            {/* Head */}
            <circle cx="50" cy="22" r="8" className="fill-emerald-400 dark:fill-emerald-300" />
            
            {/* Joined Yoga Hands High */}
            <polyline points="50,14 46,6 50,2 54,6 50,14" className="fill-emerald-300 dark:fill-emerald-400" />

            {/* Extended high curved arms */}
            <path d="M 46 32 C 35 25, 38 12, 47 6" className="stroke-emerald-500 dark:stroke-emerald-400 stroke-[4] fill-none stroke-round" />
            <path d="M 54 32 C 65 25, 62 12, 53 6" className="stroke-emerald-500 dark:stroke-emerald-400 stroke-[4] fill-none stroke-round" />

            {/* Torso */}
            <line x1="50" y1="30" x2="50" y2="65" className="stroke-emerald-500 dark:stroke-emerald-400 stroke-[5] stroke-round" />
            
            {/* Straight Supporting Leg */}
            <line x1="50" y1="65" x2="50" y2="105" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[5] stroke-round" />

            {/* Bent tree foot pressed against inner knee */}
            <polyline points="50,65 30,78 50,83" className="stroke-emerald-600 dark:stroke-emerald-500 stroke-[4.5] fill-none stroke-round" />

            {/* Ground shadow */}
            <ellipse cx="50" cy="110" rx="20" ry="3.5" className="fill-gray-200/50 dark:fill-gray-800/50" />
          </g>
        </svg>
      );
    }

    // Default rest breathing pose
    return (
      <svg viewBox="0 0 100 120" className="h-full w-full max-h-48">
        <style>{`
          @keyframes deepBreathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
          }
        `}</style>
        
        <g style={{ transformOrigin: '50px 60px', animation: 'deepBreathe 3s infinite ease-in-out' }}>
          {/* Head */}
          <circle cx="50" cy="28" r="8" className="fill-indigo-300 dark:fill-indigo-400" />
          
          {/* Torso */}
          <line x1="50" y1="36" x2="50" y2="70" className="stroke-indigo-400 dark:stroke-indigo-300 stroke-[5] stroke-round" />
          
          {/* Relaxed Arms at side */}
          <line x1="48" y1="38" x2="38" y2="65" className="stroke-indigo-400 dark:stroke-indigo-300 stroke-[4] stroke-round" />
          <line x1="52" y1="38" x2="62" y2="65" className="stroke-indigo-400 dark:stroke-indigo-300 stroke-[4] stroke-round" />

          {/* Resting folded cross legs (sitting pose) */}
          <path d="M 30 90 C 40 102, 60 102, 70 90" className="stroke-indigo-500 dark:stroke-indigo-400 stroke-[5] fill-none stroke-round" />
          <path d="M 40 85 C 45 95, 55 95, 60 85" className="stroke-indigo-500 dark:stroke-indigo-400 stroke-[5] fill-none stroke-round" />

          {/* Ground shadow */}
          <ellipse cx="50" cy="100" rx="35" ry="5" className="fill-gray-200/50 dark:fill-gray-800/50" />
        </g>
      </svg>
    );
  };

  return (
    <div 
      id="workout-player-view" 
      className="fixed inset-0 z-50 flex flex-col bg-gray-950 text-white"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900/50 border-b border-gray-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-lg">
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              Active Performance Player
            </span>
            <p className="text-sm font-display font-bold text-white max-w-[180px] sm:max-w-none truncate">
              {currentIndex + 1} of {sessionExercises.length} • {currentExercise.name}
            </p>
          </div>
        </div>

        {/* Ambient Synthesizer Controller */}
        <div className="flex items-center gap-3">
          <button
            id="player-music-toggle-btn"
            onClick={handleToggleSynth}
            className={`flex h-10 px-3 items-center gap-2 rounded-xl text-xs font-bold transition-all border ${
              synthActive
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
            }`}
            title="Toggle built-in lo-fi wellness music synthesizer"
          >
            {synthActive ? (
              <>
                <Volume2 className="h-4.5 w-4.5 animate-bounce" />
                <span className="hidden sm:inline">Synth Beats Playing</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4.5 w-4.5" />
                <span className="hidden sm:inline">Enable Synth Beats</span>
              </>
            )}
          </button>

          <button
            id="player-close-btn"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white transition-all cursor-pointer"
            title="Quit session"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="w-full bg-gray-900 h-1.5 relative">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${overallPercentage}%` }}
        />
        <div className="absolute right-3 -bottom-6 text-[10px] font-mono font-bold text-gray-500">
          {overallPercentage}% Completed
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 md:p-12 gap-10 max-w-6xl mx-auto w-full">
        {/* Left Side - Animated Humanoid Visual */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-900/40 rounded-3xl border border-gray-800 p-8 min-h-[280px] relative overflow-hidden">
          {renderHumanoid()}

          {/* Soundscape status visual indicator */}
          {synthActive && (
            <div className="absolute top-4 left-4 flex gap-1 items-end h-4">
              <span className="w-1 bg-emerald-500 rounded-full animate-[pulse_0.8s_infinite]" style={{ height: '30%' }} />
              <span className="w-1 bg-emerald-500 rounded-full animate-[pulse_1.2s_infinite]" style={{ height: '80%' }} />
              <span className="w-1 bg-emerald-500 rounded-full animate-[pulse_1.0s_infinite]" style={{ height: '50%' }} />
            </div>
          )}

          <div className="mt-6 text-center">
            <span className="inline-block rounded-full bg-emerald-950/40 border border-emerald-900/50 px-3.5 py-1 text-[11px] font-bold font-mono tracking-wider text-emerald-400 uppercase">
              {currentExercise.animationType} mode
            </span>
          </div>
        </div>

        {/* Right Side - Info & Countdown */}
        <div className="w-full md:w-1/2 flex flex-col justify-between h-full space-y-6">
          <div className="space-y-4">
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              {currentExercise.name}
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              {currentExercise.description}
            </p>
          </div>

          {/* Massive timer */}
          <div className="py-6 flex flex-col items-center md:items-start">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
              Seconds Remaining
            </span>
            <div className="flex items-baseline gap-1 mt-1 text-emerald-400">
              <span className="font-mono text-7xl sm:text-8xl font-black tracking-tighter leading-none">
                {timeLeft}
              </span>
              <span className="text-xl font-bold font-mono text-gray-600">s</span>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="pt-6 border-t border-gray-900 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              <button
                id="player-play-pause-btn"
                onClick={() => setIsPaused(!isPaused)}
                className={`flex h-14 px-6 items-center justify-center gap-2.5 rounded-2xl font-display font-bold text-sm shadow-lg transition-all cursor-pointer ${
                  isPaused
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/15'
                    : 'bg-white text-gray-950 hover:bg-gray-100 shadow-white/5'
                }`}
              >
                {isPaused ? <Play className="h-5 w-5 fill-white" /> : <Pause className="h-5 w-5 fill-gray-950" />}
                <span>{isPaused ? 'Resume Exercise' : 'Pause Workout'}</span>
              </button>

              <button
                id="player-skip-btn"
                onClick={handleSkip}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white transition-all cursor-pointer"
                title="Skip to next"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* What's next display */}
            {currentIndex < sessionExercises.length - 1 && (
              <div className="text-right hidden sm:block max-w-[200px]">
                <span className="text-[10px] font-mono font-semibold text-gray-500 uppercase tracking-widest block">
                  Coming Up Next
                </span>
                <span className="text-sm font-semibold text-gray-300 truncate block mt-0.5">
                  {sessionExercises[currentIndex + 1].name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
