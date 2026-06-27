import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Dumbbell, ShieldCheck, Target, Zap, Clock } from 'lucide-react';
import { Preferences } from '../types';

interface CustomizerModalProps {
  onClose: () => void;
  onSubmit: (preferences: Preferences) => void;
  initialPreferences?: Preferences;
}

export default function CustomizerModal({
  onClose,
  onSubmit,
  initialPreferences
}: CustomizerModalProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [goal, setGoal] = useState<Preferences['goal']>(
    initialPreferences?.goal || 'Overall Toning'
  );
  const [level, setLevel] = useState<Preferences['level']>(
    initialPreferences?.level || 'Beginner'
  );
  const [duration, setDuration] = useState<Preferences['duration']>(
    initialPreferences?.duration || 30
  );
  const [equipment, setEquipment] = useState<Preferences['equipment']>(
    initialPreferences?.equipment || ['None']
  );
  const [workoutType, setWorkoutType] = useState<Preferences['workoutType']>(
    initialPreferences?.workoutType || 'Cardio'
  );

  const toggleEquipment = (item: 'None' | 'Dumbbells' | 'Resistance Bands' | 'Yoga Mat') => {
    if (item === 'None') {
      setEquipment(['None']);
    } else {
      let updated = equipment.filter((e) => e !== 'None');
      if (updated.includes(item)) {
        updated = updated.filter((e) => e !== item);
        if (updated.length === 0) updated = ['None'];
      } else {
        updated.push(item);
      }
      setEquipment(updated as Preferences['equipment']);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onSubmit({ goal, level, duration, equipment, workoutType });
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div 
      id="customizer-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div 
        id="customizer-container" 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 transition-all duration-300"
      >
        {/* Progress header */}
        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold text-emerald-500">
              Customize Your Routine
            </span>
            <span className="font-mono text-xs font-semibold text-gray-500">
              Step {step} of {totalSteps}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 min-h-[280px] flex flex-col justify-center">
          {step === 1 && (
            <div id="step-goal" className="space-y-4 animate-fade-in">
              <div className="text-center mb-2">
                <Target className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  What is your primary fitness goal?
                </h3>
              </div>
              <div className="grid gap-2">
                {(['Lose Weight', 'Build Muscle', 'Improve Flexibility', 'Overall Toning'] as Preferences['goal'][]).map((g) => (
                  <button
                    key={g}
                    id={`goal-btn-${g.replace(/\s+/g, '-').toLowerCase()}`}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold transition-all cursor-pointer ${
                      goal === g
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-950'
                    }`}
                  >
                    <span>{g}</span>
                    {goal === g && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div id="step-level" className="space-y-4 animate-fade-in">
              <div className="text-center mb-2">
                <Zap className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  What is your current fitness level?
                </h3>
              </div>
              <div className="grid gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as Preferences['level'][]).map((l) => (
                  <button
                    key={l}
                    id={`level-btn-${l.toLowerCase()}`}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold transition-all cursor-pointer ${
                      level === l
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-950'
                    }`}
                  >
                    <div>
                      <p>{l}</p>
                      <p className="text-xs font-normal text-gray-400 mt-0.5">
                        {l === 'Beginner' && 'Gentle starting pace with extra rest breaks.'}
                        {l === 'Intermediate' && 'Moderate intensity workout with standard rests.'}
                        {l === 'Advanced' && 'Demanding pace with short, efficient recoveries.'}
                      </p>
                    </div>
                    {level === l && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div id="step-duration" className="space-y-4 animate-fade-in">
              <div className="text-center mb-2">
                <Clock className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  How much time do you have?
                </h3>
              </div>
              <div className="grid gap-2">
                {([15, 30, 45] as Preferences['duration'][]).map((d) => (
                  <button
                    key={d}
                    id={`duration-btn-${d}`}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold transition-all cursor-pointer ${
                      duration === d
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-950'
                    }`}
                  >
                    <div>
                      <span className="text-base font-bold">{d}</span> minutes
                    </div>
                    {duration === d && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div id="step-equipment" className="space-y-4 animate-fade-in">
              <div className="text-center mb-2">
                <Dumbbell className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  Select your available equipment
                </h3>
                <p className="text-xs text-gray-400 mt-1">Select all that apply or None</p>
              </div>
              <div className="grid gap-2">
                {(['None', 'Dumbbells', 'Resistance Bands', 'Yoga Mat'] as ('None' | 'Dumbbells' | 'Resistance Bands' | 'Yoga Mat')[]).map((eq) => {
                  const isSelected = equipment.includes(eq);
                  return (
                    <button
                      key={eq}
                      id={`equipment-btn-${eq.replace(/\s+/g, '-').toLowerCase()}`}
                      type="button"
                      onClick={() => toggleEquipment(eq)}
                      className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-950'
                      }`}
                    >
                      <span>{eq === 'None' ? 'None / Bodyweight Only' : eq}</span>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div id="step-type" className="space-y-4 animate-fade-in">
              <div className="text-center mb-2">
                <ShieldCheck className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  What is your preferred activity?
                </h3>
              </div>
              <div className="grid gap-2">
                {(['Yoga', 'HIIT', 'Strength Training', 'Pilates', 'Cardio'] as Preferences['workoutType'][]).map((t) => (
                  <button
                    key={t}
                    id={`type-btn-${t.replace(/\s+/g, '-').toLowerCase()}`}
                    type="button"
                    onClick={() => setWorkoutType(t)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold transition-all cursor-pointer ${
                      workoutType === t
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-950'
                    }`}
                  >
                    <span>{t}</span>
                    {workoutType === t && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-950/50">
          <button
            id="customizer-prev-btn"
            type="button"
            onClick={step === 1 ? onClose : handlePrev}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white py-2 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{step === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          <button
            id="customizer-next-btn"
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500 py-2.5 px-5 text-sm font-bold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-600 transition-all cursor-pointer"
          >
            <span>{step === totalSteps ? 'Generate Routine' : 'Next'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
