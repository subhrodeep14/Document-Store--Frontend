// src/components/SearchModal.jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X, FileText, ChevronRight } from 'lucide-react';
import { memoApi } from '../utils/api';
import { formatDisplayShort, isLocked } from '../utils/dateHelpers';

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await memoApi.search({ q: query, limit: 15 });
        setResults(res.data.memos);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-modal overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-100">
          <Search size={16} className="text-surface-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 outline-none text-sm text-surface-900 placeholder-surface-400 bg-transparent"
            placeholder="Search memos by title or memo number..."
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-surface-400 hover:text-surface-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="py-8 text-center text-sm text-surface-400">Searching...</div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="py-8 text-center text-sm text-surface-400">No memos found for "{query}"</div>
          )}

          {!query && (
            <div className="py-8 text-center text-sm text-surface-400">
              Type to search memos or use format <span className="font-mono text-xs bg-surface-100 px-1.5 py-0.5 rounded">MEMO-2026-</span> for memo numbers
            </div>
          )}

          {results.map(memo => (
            <div
              key={memo.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface-50 cursor-pointer transition-colors border-b border-surface-50 last:border-0"
            >
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={14} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{memo.memoNumber}</span>
                  {isLocked(memo.date) && <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Locked</span>}
                </div>
                <p className="text-sm font-medium text-surface-800 truncate mt-0.5">{memo.title}</p>
                <p className="text-xs text-surface-400">{formatDisplayShort(memo.date)}</p>
              </div>
              <ChevronRight size={14} className="text-surface-300" />
            </div>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-surface-100 flex justify-between text-xs text-surface-400">
          <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
          <span>ESC to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
