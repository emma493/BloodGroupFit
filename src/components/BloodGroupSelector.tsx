import { motion } from 'motion/react';
import { BloodGroup } from '../types';
import { Heart } from 'lucide-react';

interface BloodGroupSelectorProps {
  onSelect: (bloodGroup: BloodGroup) => void;
  currentSelection?: BloodGroup;
}

export default function BloodGroupSelector({ onSelect, currentSelection }: BloodGroupSelectorProps) {
  const bloodGroups: { type: BloodGroup; label: string; desc: string; color: string; border: string; bg: string }[] = [
    {
      type: 'O',
      label: 'Type O',
      desc: 'High-protein diet & intensive, active training focus.',
      color: 'text-red-500 dark:text-red-400',
      border: 'border-red-200 dark:border-red-900/50 hover:border-red-400 dark:hover:border-red-500',
      bg: 'bg-red-50/50 dark:bg-red-950/10'
    },
    {
      type: 'A',
      label: 'Type A',
      desc: 'Plant-based diet, calming practices, and organic ingredients.',
      color: 'text-blue-500 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-500',
      bg: 'bg-blue-50/50 dark:bg-blue-950/10'
    },
    {
      type: 'B',
      label: 'Type B',
      desc: 'Strong adaptable immune system, balanced omnivore.',
      color: 'text-amber-500 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-500',
      bg: 'bg-amber-50/50 dark:bg-amber-950/10'
    },
    {
      type: 'AB',
      label: 'Type AB',
      desc: 'Rare mixed profile, focus on seafood, tofu, & recovery.',
      color: 'text-purple-500 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-500',
      bg: 'bg-purple-50/50 dark:bg-purple-950/10'
    }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 text-center">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400">
          <Heart className="h-8 w-8 animate-pulse" />
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Select Your Blood Group
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-base text-gray-500 dark:text-gray-400">
          This serves as the foundation for your diet guide, health tips, and customized exercise recommendations. You can change this at any time.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {bloodGroups.map((group, idx) => {
          const isSelected = currentSelection === group.type;
          return (
            <motion.div
              key={group.type}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              id={`blood-card-${group.type}`}
              onClick={() => onSelect(group.type)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/30 dark:border-emerald-500 dark:bg-emerald-950/20'
                  : `border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${group.border}`
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className={`font-display text-3xl font-black ${group.color}`}>
                    {group.label}
                  </h2>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-300">
                    {group.desc}
                  </p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${group.bg} ${group.color}`}>
                  Select
                </div>
              </div>

              {isSelected && (
                <div className="absolute right-0 bottom-0 h-8 w-8 rounded-tl-xl bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
