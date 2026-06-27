import { useState, FormEvent } from 'react';
import { Mail, Lock, User, CheckCircle, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onOnboardComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onOnboardComplete }: OnboardingProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignUp && !name) {
      setError('Please enter your full name.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // In a real application, passwords would be hashed on a server.
    // Here we save the credentials to localStorage and log the user in immediately.
    const normalizedEmail = email.trim().toLowerCase();

    if (isSignUp) {
      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem('bgf_registered_users') || '[]');
      const userExists = existingUsers.some((u: any) => u.email === normalizedEmail);

      if (userExists) {
        setError('An account with this email already exists.');
        return;
      }

      // Add user to database
      const newUser = { name, email: normalizedEmail, password };
      existingUsers.push(newUser);
      localStorage.setItem('bgf_registered_users', JSON.stringify(existingUsers));

      // Set active session
      const newProfile: UserProfile = {
        name,
        email: normalizedEmail,
        theme: 'light',
      };
      localStorage.setItem('bgf_active_session', JSON.stringify(newProfile));
      onOnboardComplete(newProfile);
    } else {
      // Login flow
      const existingUsers = JSON.parse(localStorage.getItem('bgf_registered_users') || '[]');
      const matchingUser = existingUsers.find(
        (u: any) => u.email === normalizedEmail && u.password === password
      );

      if (!matchingUser) {
        setError('Invalid email or password. Please try again.');
        return;
      }

      // Restore user session
      const savedProfileStr = localStorage.getItem(`bgf_profile_${normalizedEmail}`);
      let profile: UserProfile;

      if (savedProfileStr) {
        profile = JSON.parse(savedProfileStr);
      } else {
        profile = {
          name: matchingUser.name,
          email: normalizedEmail,
          theme: 'light',
        };
      }

      localStorage.setItem('bgf_active_session', JSON.stringify(profile));
      onOnboardComplete(profile);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10 px-4">
      <div 
        id="onboarding-card" 
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900 transition-all duration-300"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isSignUp
              ? 'Discover diet and workouts customized to your blood group'
              : 'Log in to continue your personalized health journey'}
          </p>
        </div>

        {error && (
          <div 
            id="onboarding-error" 
            className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400"
          >
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="signup-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-emerald-400 dark:focus:bg-gray-900 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="onboarding-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-emerald-400 dark:focus:bg-gray-900 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="onboarding-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-emerald-400 dark:focus:bg-gray-900 transition-all"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="signup-confirm-password-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-emerald-400 dark:focus:bg-gray-900 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <button
            id="onboarding-submit-btn"
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 px-4 font-display text-sm font-bold text-white shadow-lg shadow-emerald-500/15 hover:bg-emerald-600 hover:shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <CheckCircle className="h-4 w-4" />
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              id="onboarding-toggle-view"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline transition-all cursor-pointer"
            >
              {isSignUp ? 'Sign In Instead' : 'Register Here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
