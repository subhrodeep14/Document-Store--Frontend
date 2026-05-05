// src/components/DayPanel.jsx
// COMPLETE REPLACEMENT — includes the new "Entries" tab
import { useState } from 'react';
import { X, Lock, FileText, Activity, FolderOpen, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDisplay, isLocked } from '../utils/dateHelpers';
import MemoSection from './MemoSection';
import ActivitySection from './ActivitySection';
import FileSection from './FileSection';
import EntrySection from './EntrySection';

const TABS = [
  { id: 'entries', label: 'Entries', icon: ClipboardList, accent: 'indigo' },
  { id: 'memos', label: 'Memos', icon: FileText, accent: 'blue' },
  { id: 'activities', label: 'Activities', icon: Activity, accent: 'emerald' },
  { id: 'files', label: 'Files', icon: FolderOpen, accent: 'violet' },
];

const accentMap = {
  indigo: 'bg-indigo-600 text-white',
  blue: 'bg-blue-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  violet: 'bg-violet-600 text-white',
};

export default function DayPanel({ date, onClose, onChange }) {
  const [activeTab, setActiveTab] = useState('entries');
  const locked = isLocked(date);

  return (
    <div
      className="flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-0 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900" style={{ fontFamily: "'Fraunces', serif", fontWeight: 300 }}>
              {formatDisplay(date)}
            </h2>
            {locked && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[11px] font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                <Lock size={10} />
                Locked — read only
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600 -mt-0.5 -mr-1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5">
          {TABS.map(({ id, label, icon: Icon, accent }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-medium transition-all ${
                activeTab === id
                  ? `${accentMap[accent]} shadow-sm`
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={12} />
              {label}
              {activeTab === id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/40 rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'entries' && (
              <EntrySection date={date} onChange={onChange} />
            )}
            {activeTab === 'memos' && (
              <MemoSection date={date} locked={locked} onChange={onChange} />
            )}
            {activeTab === 'activities' && (
              <ActivitySection date={date} locked={locked} onChange={onChange} />
            )}
            {activeTab === 'files' && (
              <FileSection date={date} locked={locked} onChange={onChange} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
