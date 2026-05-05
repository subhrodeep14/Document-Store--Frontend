// src/components/StatsBar.jsx
// COMPLETE REPLACEMENT — adds Entries stat
import { useEffect, useState } from 'react';
import { FileText, Activity, FolderOpen, ClipboardList } from 'lucide-react';
import { calendarApi } from '../utils/api';

export default function StatsBar() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    calendarApi.getStats()
      .then((r) => setStats(r.data.stats))
      .catch(() => {});
  }, []);

  const items = [
    {
      label: 'Entries',
      value: stats?.totalEntries ?? '—',
      icon: ClipboardList,
      color: 'text-indigo-600 bg-indigo-50',
      border: 'border-l-2 border-l-indigo-400',
    },
    {
      label: 'Memos',
      value: stats?.totalMemos ?? '—',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
      border: 'border-l-2 border-l-blue-400',
    },
    {
      label: 'Activities',
      value: stats?.totalActivities ?? '—',
      icon: Activity,
      color: 'text-emerald-600 bg-emerald-50',
      border: 'border-l-2 border-l-emerald-400',
    },
    {
      label: 'Documents',
      value: stats?.totalFiles ?? '—',
      icon: FolderOpen,
      color: 'text-violet-600 bg-violet-50',
      border: 'border-l-2 border-l-violet-400',
    },
  ];

  return (
    <div className="flex gap-3">
      {items.map(({ label, value, icon: Icon, color, border }) => (
        <div key={label} className={`card flex items-center gap-3 px-4 py-3 flex-1 ${border}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} flex-shrink-0`}>
            <Icon size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-surface-400 truncate">{label}</p>
            <p className="text-lg font-semibold text-surface-900 leading-tight">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
