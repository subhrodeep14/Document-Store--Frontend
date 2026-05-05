// src/components/EntrySection.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { entryApi } from '../utils/api';
import EntryCard from './EntryCard';
import CreateEntryModal from './CreateEntryModal';

export default function EntrySection({ date, onChange }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await entryApi.getByDate(date);
      setEntries(res.data.entries || []);
    } catch {
      toast.error('Failed to load entries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [date]);

  const handleSuccess = (newEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
    onChange?.();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <RefreshCw size={18} className="text-slate-300 animate-spin" />
        <p className="text-xs text-slate-400">Loading entries…</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Add button */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center gap-2 px-3 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all duration-200 hover:bg-indigo-50/30"
      >
        <Plus size={14} />
        Create new entry
      </button>

      {/* Entry list */}
      {entries.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Plus size={20} className="text-slate-400" />
          </div>
          <p className="text-sm text-slate-500 font-medium">No entries yet</p>
          <p className="text-xs text-slate-400 mt-1">Click the button above to create one</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <EntryCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <CreateEntryModal
            date={date}
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
