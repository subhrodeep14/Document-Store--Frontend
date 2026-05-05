// src/components/Layout.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Moon, Sun, LogOut, User } from 'lucide-react';
import useAuthStore from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children, onSearch }) {
  const [isDark, setIsDark] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleDark = () => {
    setIsDark(v => !v);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col">
      {/* Navbar */}
      <header className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 px-6 h-14 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 bg-accent-600 rounded-lg">
            <Shield size={14} className="text-white" />
          </div>
          <span className="font-display text-lg font-light text-surface-900 dark:text-surface-100">
            Secure CalDoc
          </span>
          <span className="hidden sm:block text-xs text-surface-400 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSearch && (
            <button
              onClick={onSearch}
              className="btn-ghost text-sm"
              title="Search memos (⌘K)"
            >
              <Search size={15} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline text-[10px] bg-surface-100 px-1.5 py-0.5 rounded text-surface-400 font-mono">
                ⌘K
              </kbd>
            </button>
          )}

          <button onClick={toggleDark} className="btn-ghost p-2" title="Toggle dark mode">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-1.5 text-xs text-surface-500">
              <User size={12} />
              <span className="hidden sm:inline">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-ghost p-2 text-surface-500 hover:text-red-500"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
