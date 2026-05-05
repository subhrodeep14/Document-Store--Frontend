// src/components/EntryCard.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, ExternalLink, Hash, Building2, ArrowRight,
  FileText, ImageIcon, Send, Calendar, Clock,
} from 'lucide-react';
import { format } from 'date-fns';

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const purposeColors = [
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
];

function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return purposeColors[Math.abs(h) % purposeColors.length];
}

export default function EntryCard({ entry, index = 0 }) {
  const [expanded, setExpanded] = useState(false);

  const hasFile = Boolean(entry.fileUrl);
  const isPDF = entry.fileMime === 'application/pdf';
  const colorClass = hashColor(entry.purpose || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Card header — always visible */}
      <div
        className="px-4 py-3 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Top row: memo number + SL badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Hash size={11} className="text-indigo-600" />
            </div>
            <span className="font-mono text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg">
              {entry.memoNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
              SL #{entry.slNo}
            </span>
            {expanded ? (
              <ChevronUp size={14} className="text-slate-400" />
            ) : (
              <ChevronDown size={14} className="text-slate-400" />
            )}
          </div>
        </div>

        {/* Company flow */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Building2 size={10} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-700 truncate leading-tight">{entry.senderName}</p>
              <p className="font-mono text-[10px] text-slate-400">{entry.senderCode}</p>
            </div>
          </div>

          <ArrowRight size={12} className="text-slate-300 flex-shrink-0 mx-0.5" />

          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Building2 size={10} className="text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-700 truncate leading-tight">{entry.receiverName}</p>
              <p className="font-mono text-[10px] text-slate-400">{entry.receiverCode}</p>
            </div>
          </div>
        </div>

        {/* Purpose tag + send count */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colorClass} truncate max-w-[160px]`}>
            {entry.purpose}
          </span>
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            <Send size={10} className="text-slate-400" />
            <span className="text-[10px] text-slate-500">×{entry.sendCount}</span>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
              {/* Description */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</p>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{entry.description}</p>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-slate-400" />
                  <span className="text-[11px] text-slate-500">
                    {format(new Date(entry.date), 'dd MMM yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-slate-400" />
                  <span className="text-[11px] text-slate-500">
                    {format(new Date(entry.createdAt), 'hh:mm a')}
                  </span>
                </div>
              </div>

              {/* File attachment */}
              {hasFile && (
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isPDF ? 'bg-red-100' : 'bg-blue-100'}`}>
                    {isPDF
                      ? <FileText size={15} className="text-red-600" />
                      : <ImageIcon size={15} className="text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">
                      {entry.fileName || 'Attachment'}
                    </p>
                    <p className="text-[10px] text-slate-400">{isPDF ? 'PDF Document' : 'Image'}</p>
                  </div>
                  <a
                    href={entry.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <ExternalLink size={11} />
                    Open
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
