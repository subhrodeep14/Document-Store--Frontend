// src/components/ActivitySection.jsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { activityApi } from '../utils/api';
import { activityTypeConfig } from '../utils/dateHelpers';

const TYPES = ['general', 'meeting', 'task', 'note'];

const defaultForm = { title: '', description: '', startTime: '', endTime: '', type: 'general' };

export default function ActivitySection({ date, locked, onChange }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [editForm, setEditForm] = useState({});

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await activityApi.getByDate(date);
      setActivities(res.data.activities);
    } catch {
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [date]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await activityApi.create({ ...form, date });
      toast.success('Activity added');
      setShowForm(false);
      setForm(defaultForm);
      load();
      onChange?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create');
    }
  };

  const handleUpdate = async (id) => {
    try {
      await activityApi.update(id, editForm);
      toast.success('Updated');
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this activity?')) return;
    try {
      await activityApi.delete(id);
      toast.success('Deleted');
      load();
      onChange?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  if (isLoading) return <div className="text-center py-8 text-surface-400 text-sm">Loading...</div>;

  return (
    <div className="space-y-3">
      {!locked && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 border-2 border-dashed border-surface-200 rounded-lg text-sm text-surface-400 hover:border-accent-400 hover:text-accent-600 transition-all"
        >
          <Plus size={14} />
          Add activity
        </button>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="bg-emerald-50 rounded-xl p-4 space-y-3 border border-emerald-200 overflow-hidden"
          >
            <div>
              <label className="label">Title</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input text-sm" placeholder="Activity title..." required autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input text-sm">
                  {TYPES.map(t => <option key={t} value={t}>{activityTypeConfig[t].label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Start Time</label>
                <input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} className="input text-sm" />
              </div>
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="textarea text-sm" rows={3} placeholder="Notes..." />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-xs"><X size={12}/> Cancel</button>
              <button type="submit" className="btn-primary text-xs py-1.5"><Save size={12}/> Add</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {activities.length === 0 && !showForm && (
        <p className="text-center py-8 text-surface-400 text-sm">No activities for this date</p>
      )}

      <div className="space-y-2">
        {activities.map(act => {
          const typeConf = activityTypeConfig[act.type] || activityTypeConfig.general;
          const isEditing = editingId === act.id;
          return (
            <div key={act.id} className="bg-white rounded-xl border border-surface-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeConf.color}`}>{typeConf.label}</span>
                    {act.startTime && (
                      <span className="flex items-center gap-0.5 text-[10px] text-surface-400">
                        <Clock size={9}/> {act.startTime}{act.endTime ? ` – ${act.endTime}` : ''}
                      </span>
                    )}
                  </div>
                  {isEditing ? (
                    <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="input text-sm font-medium" />
                  ) : (
                    <p className="text-sm font-medium text-surface-800">{act.title}</p>
                  )}
                  {!isEditing && act.description && (
                    <p className="text-xs text-surface-500 mt-1 line-clamp-2">{act.description}</p>
                  )}
                  {isEditing && (
                    <textarea value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} className="textarea text-sm mt-2" rows={3} />
                  )}
                </div>
                {!locked && !act.isLocked && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isEditing ? (
                      <>
                        <button onClick={() => handleUpdate(act.id)} className="btn-ghost p-1.5"><Save size={13} className="text-accent-600"/></button>
                        <button onClick={() => setEditingId(null)} className="btn-ghost p-1.5"><X size={13}/></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(act.id); setEditForm({ title: act.title, description: act.description, type: act.type }); }} className="btn-ghost p-1.5"><Edit3 size={13}/></button>
                        <button onClick={() => handleDelete(act.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-600"><Trash2 size={13}/></button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
