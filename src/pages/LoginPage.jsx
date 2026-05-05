// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const register = useAuthStore(s => s.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !confirmPassword)) return;
    setIsLoading(true);
    try {
      if (isRegister) {
        await register(email, password, confirmPassword);
        toast.success('Account created successfully');
      } else {
        await login(email, password);
        toast.success('Welcome back');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      {/* Background texture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-600 rounded-2xl mb-4 shadow-lg">
              <Shield size={22} className="text-white" />
            </div>
            <h1 className="font-display text-3xl text-surface-900 font-light mb-1">
              {isRegister ? 'Create your account' : 'Secure CalDoc'}
            </h1>
            <p className="text-sm text-surface-400">
              {isRegister ? 'Register a new profile to access your dashboard' : 'Sign in to continue'}
            </p>
          </div>
        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="admin@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••••••"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="label">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary justify-center py-2.5 text-base"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isRegister ? 'Creating account...' : 'Authenticating...'}
                </span>
              ) : (
                <>
                  <Lock size={16} />
                  {isRegister ? 'Create profile' : 'Sign in securely'}
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-5 text-center text-sm text-surface-500">
            {isRegister ? (
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-accent-600 hover:text-accent-700 transition-colors"
              >
                Already have an account? Sign in
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-accent-600 hover:text-accent-700 transition-colors"
              >
                Create a new profile
              </button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-surface-100 flex items-center gap-2 text-xs text-surface-400">
            <Shield size={12} />
            <span>Session expires after 24 hours • Entries locked after 1 year</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
