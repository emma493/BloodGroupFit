import { BloodGroup, BloodGroupDiet, Exercise, Preferences, ScheduledWorkout } from './types';

export const BLOOD_GROUP_DATA: Record<BloodGroup, BloodGroupDiet> = {
  O: {
    reason: "Type Os thrive on intense physical activity, high-protein foods, and a lower-carb intake. Historically known as 'The Hunter', Type Os process animal proteins efficiently due to high stomach acid levels, but can experience metabolic slow-downs when consuming gluten, grains, and legumes.",
    eat: [
      { category: "Proteins", items: ["Lean Beef", "Lamb", "Salmon", "Cod", "Mackerel", "Venison"] },
      { category: "Vegetables & Greens", items: ["Spinach", "Kale", "Broccoli", "Onions", "Sweet Potatoes", "Seaweed"] },
      { category: "Seeds & Nuts", items: ["Pumpkin Seeds", "Walnuts", "Flaxseeds"] },
      { category: "Fruits", items: ["Plums", "Figs", "Prunes", "Blueberries"] }
    ],
    avoid: [
      { category: "Grains & Gluten", items: ["Wheat Gluten", "Corn", "Barley", "Rye"], reason: "Contains lectins that interfere with insulin activity and slow down metabolic rate." },
      { category: "Dairy & Eggs", items: ["Whole Milk", "Yogurt", "Cheese (Cheddar, Swiss)", "Ice Cream"], reason: "Highly inflammatory and poorly digested by Type Os, leading to sluggishness." },
      { category: "Legumes", items: ["Kidney Beans", "Lentils", "Navy Beans"], reason: "Contains proteins that inhibit fat burning and cause calorie stagnation." },
      { category: "Vegetables to Limit", items: ["Cabbage", "Cauliflower", "Brussels Sprouts"], reason: "Can inhibit thyroid hormone production, which is already sensitive in Type Os." }
    ],
    generalExercise: "High-intensity aerobics, running, HIIT, interval training, or weightlifting.",
    tips: [
      "Focus on high-quality animal proteins and fresh vegetables.",
      "Engage in vigorous cardiovascular workouts 3-4 times a week to de-stress and maintain optimal hormonal levels.",
      "Avoid eating heavy grains or gluten close to bedtime to prevent digestive inflammation.",
      "Take high-quality digestive enzymes if consuming legumes."
    ]
  },
  A: {
    reason: "Type As thrive on a sensitive, plant-based diet and gentle, stress-reducing exercises. Historically known as 'The Cultivator', Type As have naturally low levels of stomach acid, making red meats difficult to digest, but they excel at processing organic grains, soy proteins, and fresh vegetables.",
    eat: [
      { category: "Soy & Plant Proteins", items: ["Tofu", "Tempeh", "Lentils", "Black Beans", "Soy Milk"] },
      { category: "Grains & Cereals", items: ["Oatmeal", "Buckwheat", "Amaranth", "Rye Flour"] },
      { category: "Vegetables", items: ["Broccoli", "Carrots", "Spinach", "Garlic", "Onions", "Artichokes"] },
      { category: "Fruits & Oils", items: ["Pineapple", "Berries", "Plums", "Extra Virgin Olive Oil"] }
    ],
    avoid: [
      { category: "Meats & Poultry", items: ["Red Meat", "Pork", "Venison", "Duck", "Bacon"], reason: "Low stomach acid causes red meat to be stored as fat and increases toxic load in the digestive tract." },
      { category: "Heavy Dairy", items: ["Cow's Milk", "Ice Cream", "Blue Cheese"], reason: "Triggers excessive mucus production and digestive congestion." },
      { category: "Certain Fruits", items: ["Bananas", "Oranges", "Coconuts", "Mangoes"], reason: "Can interfere with mineral absorption and cause digestive irritation." },
      { category: "Nightshades", items: ["Tomatoes", "Eggplants", "Potatoes"], reason: "Contains solanine which can trigger joint discomfort and stomach distress." }
    ],
    generalExercise: "Hatha Yoga, Tai Chi, pilates, deep stretching, and brisk walking.",
    tips: [
      "Keep your food in as natural a state as possible—fresh, organic, and minimally processed.",
      "Incorporate calming, mindfulness-based workouts to reduce high baseline cortisol (stress hormone) levels.",
      "Begin your day with a glass of warm water squeezed with fresh lemon to stimulate digestion.",
      "Swap black coffee for high-antioxidant green tea to protect your sensitive immune system."
    ]
  },
  B: {
    reason: "Type Bs are highly adaptable and possess a strong, balanced digestive system. Historically known as 'The Nomad', Type Bs can thrive on a diverse, omnivorous diet including a wide variety of grains, vegetables, meats, and dairy. However, specific lectins in chicken, corn, and wheat can severely disrupt their metabolism.",
    eat: [
      { category: "Proteins", items: ["Lamb", "Goat", "Mutton", "Rabbit", "Cod", "Salmon", "Halibut"] },
      { category: "Dairy & Eggs", items: ["Eggs", "Yogurt", "Kefir", "Goat Cheese", "Cottage Cheese"] },
      { category: "Vegetables", items: ["Broccoli", "Cabbage", "Carrots", "Beets", "Shiitake Mushrooms"] },
      { category: "Grains & Fruits", items: ["Oatmeal", "Rice Bran", "Bananas", "Grapes", "Pineapple"] }
    ],
    avoid: [
      { category: "Poultry & Meats", items: ["Chicken", "Pork", "Duck"], reason: "Chicken contains a blood-agglutinating lectin in its muscle tissue that can trigger immune reactions and slow metabolism." },
      { category: "Grains & Seeds", items: ["Wheat", "Corn", "Buckwheat", "Rye", "Peanuts", "Sesame Seeds"], reason: "Interferes with insulin production, leading to fluid retention and fatigue." },
      { category: "Certain Veggies", items: ["Tomatoes", "Avocados", "Olives"], reason: "Contains strong lectins that can irritate the stomach lining." }
    ],
    generalExercise: "Moderate physical activities with a mental element, such as hiking, cycling, tennis, swimming, or brisk walking.",
    tips: [
      "Incorporate clean, low-fat dairy like yogurt and goat cheese which your body processes exceptionally well.",
      "Replace chicken with turkey, lamb, or seafood to keep your energy and metabolism balanced.",
      "Combine active fitness routines (like cycling) with restorative stretching to keep both mind and body in check.",
      "Take licorice root or ginger tea to support gut motility and prevent digestive wind."
    ]
  },
  AB: {
    reason: "Type ABs are a rare, evolutionary mix of Type A and Type B, presenting a highly complex digestive profile. Known as 'The Enigma', Type ABs have the low stomach acid of Type A combined with the dietary adaptation of Type B. They do well with seafood, tofu, and dairy, but must manage portions carefully.",
    eat: [
      { category: "Plant & Sea Proteins", items: ["Tofu", "Salmon", "Mackerel", "Sardines", "Tuna", "Kelp"] },
      { category: "Dairy & Fermented", items: ["Yogurt", "Kefir", "Goat Milk", "Sour Cream", "Miso"] },
      { category: "Greens & Veggies", items: ["Kale", "Broccoli", "Celery", "Garlic", "Cucumber", "Eggplant"] },
      { category: "Fruits & Grains", items: ["Grapes", "Plums", "Figs", "Oatmeal", "Brown Rice", "Spelt"] }
    ],
    avoid: [
      { category: "Meats & Poultry", items: ["Chicken", "Beef", "Pork", "Venison", "Duck"], reason: "Low stomach acid makes beef hard to metabolize, while chicken contains A/B reactive lectins." },
      { category: "Grains & Seeds", items: ["Corn", "Buckwheat", "Rye", "Sesame Seeds", "Sunflower Seeds"], reason: "Triggers insulin crashes and can cause digestive fluid stagnation." },
      { category: "Certain Fruits & Veg", items: ["Bananas", "Oranges", "Coconuts", "Guava", "Black Olives"], reason: "Oranges can irritate the stomach, while bananas contain high lectin content." }
    ],
    generalExercise: "A balanced mixture of calming (Yoga, Pilates) and moderate aerobic (Hiking, Tennis, Swimming) exercise.",
    tips: [
      "Focus on seafood and tofu as your primary proteins; they are easily broken down by your digestive enzymes.",
      "Eat smaller, more frequent meals to accommodate lower stomach acid levels without bloat.",
      "Limit caffeine and alcohol, which can spike adrenaline—a hormone AB types already produce in high volumes under stress.",
      "Incorporate sea vegetables like Kelp and Algae to support thyroid function and detox."
    ]
  }
};

export const EXERCISE_LIBRARY: Exercise[] = [
  {
    id: "ex_jumping_jacks",
    name: "Jumping Jacks",
    duration: 30,
    caloriesPerMin: 10,
    animationType: "jumping-jacks",
    description: "Start standing, jump up to spread legs and raise hands above head, then jump back to starting position. Great for full-body cardiovascular warming."
  },
  {
    id: "ex_squats",
    name: "Bodyweight Squats",
    duration: 45,
    caloriesPerMin: 8,
    animationType: "squats",
    description: "Lower your hips from a standing position, keeping your back straight and knees behind toes, then return to standing. Strengthens glutes and thighs."
  },
  {
    id: "ex_plank",
    name: "Forearm Plank Hold",
    duration: 45,
    caloriesPerMin: 4,
    animationType: "plank",
    description: "Hold your body in a straight line supported by your forearms and toes. Keep your core tight and gaze down. Builds core endurance."
  },
  {
    id: "ex_pushups",
    name: "Classic Push Ups",
    duration: 30,
    caloriesPerMin: 9,
    animationType: "pushups",
    description: "With hands shoulder-width apart, lower your body until your chest almost touches the floor, then push back up. Develops upper body strength."
  },
  {
    id: "ex_tree_pose",
    name: "Tree Pose Balance",
    duration: 40,
    caloriesPerMin: 3,
    animationType: "yoga-tree",
    description: "Place the sole of one foot against the inner thigh or calf of your standing leg, bring hands to heart center or reach high, and focus your gaze. Improves balance and focus."
  },
  {
    id: "ex_rest",
    name: "Rest & Hydrate",
    duration: 15,
    caloriesPerMin: 1.5,
    animationType: "rest",
    description: "Catch your breath, stretch lightly, take a sip of water, and prepare your mind for the next movement."
  }
];

// Map fitness goals to exercise sets
const GOAL_EXERCISE_MAPPING: Record<string, string[]> = {
  "Lose Weight": ["ex_jumping_jacks", "ex_squats", "ex_jumping_jacks", "ex_pushups", "ex_jumping_jacks"],
  "Build Muscle": ["ex_squats", "ex_pushups", "ex_plank", "ex_squats", "ex_pushups"],
  "Improve Flexibility": ["ex_tree_pose", "ex_plank", "ex_tree_pose", "ex_plank", "ex_tree_pose"],
  "Overall Toning": ["ex_jumping_jacks", "ex_squats", "ex_plank", "ex_pushups", "ex_tree_pose"]
};

/**
 * Generate a 7-day personalized workout schedule based on user preferences.
 */
export function generateWeeklySchedule(preferences: Preferences): ScheduledWorkout[] {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const exercisesMapped = GOAL_EXERCISE_MAPPING[preferences.goal] || ["ex_jumping_jacks", "ex_squats", "ex_plank"];

  return days.map((day, index) => {
    // 2 Rest Days (Wednesday, Sunday) for Beginners, 1 Rest Day for Intermediate, 1 Rest Day for Advanced
    const isRestDay = (preferences.level === "Beginner" && (index === 2 || index === 6)) ||
                     (preferences.level === "Intermediate" && index === 6) ||
                     (preferences.level === "Advanced" && index === 6);

    if (isRestDay) {
      return {
        day,
        type: "Active Recovery",
        duration: 15,
        exercises: ["Tree Pose Balance", "Rest & Hydrate"],
        completed: false
      };
    }

    // Determine type based on workout type preference and goal
    let workoutName = `${preferences.workoutType} - Core & Burn`;
    if (preferences.workoutType === 'Yoga') {
      workoutName = "Vinyasa Flow & Balance";
    } else if (preferences.workoutType === 'HIIT') {
      workoutName = "High Intensity Tabata";
    }

    // Map exercise IDs to names
    const exerciseNames: string[] = [];
    // Repeat sequence to fill duration if needed
    const loops = preferences.duration === 45 ? 3 : preferences.duration === 30 ? 2 : 1;

    for (let l = 0; l < loops; l++) {
      exercisesMapped.forEach((id) => {
        const ex = EXERCISE_LIBRARY.find(e => e.id === id);
        if (ex) {
          exerciseNames.push(ex.name);
          // Add a Rest after every active exercise
          exerciseNames.push("Rest & Hydrate");
        }
      });
    }

    // Remove the trailing Rest & Hydrate
    if (exerciseNames.length > 0 && exerciseNames[exerciseNames.length - 1] === "Rest & Hydrate") {
      exerciseNames.pop();
    }

    return {
      day,
      type: workoutName,
      duration: preferences.duration,
      exercises: exerciseNames,
      completed: false
    };
  });
}

/**
 * Custom Synthesizer using Web Audio API to play a gorgeous, relaxing lo-fi ambient wellness soundscape
 */
class WellnessSynth {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private oscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private beatInterval: NodeJS.Timeout | null = null;

  public start() {
    if (this.isPlaying) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.isPlaying = true;

      // Play continuous relaxing pad drone (chords)
      this.playDrone();

      // Start a soft lo-fi repetitive kick/snare and chime pattern
      this.startBeat();
    } catch (e) {
      console.error("Failed to start soundscape synthesizer:", e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
    this.oscillators.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
    });
    this.oscillators = [];
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }

  private playDrone() {
    if (!this.audioCtx) return;

    // F-major7 or C-major ambient chord frequencies (C3, E3, G3, B3)
    const freqs = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3

    freqs.forEach((freq, index) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle'; // Soft, warm triangle wave
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Low frequency oscillator (LFO) for volume swells
      const lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.1 + index * 0.05, this.audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      // Connect nodes
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      // Soft overall level
      gain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);

      osc.start();
      lfo.start();

      this.oscillators.push({ osc, gain });
    });
  }

  private startBeat() {
    let step = 0;
    const tempo = 80; // Lo-fi BPM
    const intervalMs = (60 / tempo) * 1000;

    this.beatInterval = setInterval(() => {
      if (!this.audioCtx || this.audioCtx.state === 'suspended') return;

      // Soft kick on beat 0 and 2
      if (step % 4 === 0) {
        this.playSoftKick();
      }

      // Soft chime/plink on randomized intervals for ambient feeling
      if (step % 8 === 2 || step % 8 === 6) {
        this.playSoftChime();
      }

      step = (step + 1) % 8;
    }, intervalMs);
  }

  private playSoftKick() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.frequency.setValueAtTime(100, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.35);
  }

  private playSoftChime() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.type = 'sine';
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00]; // Pentatonic notes C5, D5, E5, G5, A5
    const freq = notes[Math.floor(Math.random() * notes.length)];

    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 1.3);
  }
}

export const soundscape = new WellnessSynth();
