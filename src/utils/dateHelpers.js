// src/utils/dateHelpers.js
import { format, isAfter, subYears, parseISO } from 'date-fns';

export const formatDateKey = (date) => format(new Date(date), 'yyyy-MM-dd');

export const formatDisplay = (date) => format(new Date(date), 'MMMM d, yyyy');

export const formatDisplayShort = (date) => format(new Date(date), 'MMM d, yyyy');

export const isLocked = (date) => {
  const entryDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  const oneYearAgo = subYears(new Date(), 1);
  return isAfter(oneYearAgo, entryDate);
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const activityTypeConfig = {
  general: { label: 'General', color: 'bg-gray-100 text-gray-700' },
  meeting: { label: 'Meeting', color: 'bg-blue-100 text-blue-700' },
  task: { label: 'Task', color: 'bg-green-100 text-green-700' },
  note: { label: 'Note', color: 'bg-purple-100 text-purple-700' },
};
