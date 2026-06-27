import { Sun, Moon, LogOut, HeartPulse } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  onThemeToggle: () => void;
  onLogout: () => void;
  onNavigate: (view: 'dashboard' | 'analytics') => void;
  currentView: 'dashboard' | 'analytics';
}

export default function Navbar({
  user,
  onThemeToggle,
  onLogout,
  onNavigate,
  currentView
}: NavbarProps) {
  return (
    <nav 
      id="main-navbar" 
      className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80 transition-colors duration-300"
    >
      <div 
        id="navbar-brand" 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => onNavigate('dashboard')}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
          <HeartPulse className="h-6 w-6" />
        </div>
        <span className="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          BloodGroup<span className="text-emerald-500">Fit</span>
        </span>
      </div>

      <div id="navbar-controls" className="flex items-center gap-4">
        {user && (
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <button
              id="nav-dashboard-btn"
              onClick={() => onNavigate('dashboard')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              id="nav-analytics-btn"
              onClick={() => onNavigate('analytics')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'analytics'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>
        )}

        <button
          id="theme-toggle-btn"
          onClick={onThemeToggle}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-all cursor-pointer"
          title="Toggle visual theme"
        >
          {user?.theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {user && (
          <button
            id="logout-btn"
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
            title="Log out of account"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
}
