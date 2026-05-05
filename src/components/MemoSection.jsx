// src/components/MemoSection.jsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { memoApi } from '../utils/api';

export default function MemoSection({ date, locked, onChange }) {
  const [memos, setMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await memoApi.getByDate(date);
      setMemos(res.data.memos);
    } catch {
      toast.error('Failed to load memos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [date]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      await memoApi.create({ ...form, date });
      toast.success('Memo created');
      setShowForm(false);
      setForm({ title: '', description: '' });
      load();
      onChange?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create memo');
    }
  };

  const handleUpdate = async (id) => {
    const memo = memos.find(m => m.id === id);
    try {
      await memoApi.update(id, { title: memo.title, description: memo.description });
      toast.success('Memo updated');
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this memo?')) return;
    try {
      await memoApi.delete(id);
      toast.success('Memo deleted');
      load();
      onChange?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const updateLocal = (id, field, value) => {
    setMemos(memos.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  if (isLoading) return <div className="text-center py-8 text-surface-400 text-sm">Loading...</div>;

  return (
    <div className="space-y-3">
      {/* Add button */}
      {!locked && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 border-2 border-dashed border-surface-200 rounded-lg text-sm text-surface-400 hover:border-accent-400 hover:text-accent-600 transition-all"
        >
          <Plus size={14} />
          Add memo
        </button>
      )}

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="bg-accent-50 rounded-xl p-4 space-y-3 border border-accent-200 overflow-hidden"
          >
            <div>
              <label className="label">Title</label>
              <input
                autoFocus
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="input text-sm"
                placeholder="Memo title..."
                required
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="textarea text-sm"
                rows={3}
                placeholder="Optional details..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-xs">
                <X size={12} /> Cancel
              </button>
              <button type="submit" className="btn-primary text-xs py-1.5">
                <Save size={12} /> Create Memo
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Memo list */}
      {memos.length === 0 && !showForm && (
        <p className="text-center py-8 text-surface-400 text-sm">No memos for this date</p>
      )}

      <div className="space-y-2">
        {memos.map(memo => (
          <motion.div
            key={memo.id}
            layout
            className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden"
          >
            <div
              className="p-3 cursor-pointer hover:bg-surface-50 transition-colors"
              onClick={() => setExpandedId(expandedId === memo.id ? null : memo.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-memo font-mono">{memo.memoNumber}</span>
                    {memo.isLocked && <span className="badge-locked"><Lock size={9} />Locked</span>}
                  </div>
                  {editingId === memo.id ? (
                    <input
                      value={memo.title}
                      onChange={e => updateLocal(memo.id, 'title', e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="input text-sm font-medium"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm font-medium text-surface-800 truncate">{memo.title}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  {!locked && !memo.isLocked && (
                    editingId === memo.id ? (
                      <>
                        <button onClick={() => handleUpdate(memo.id)} className="btn-ghost p-1.5">
                          <Save size={13} className="text-accent-600" />
                        </button>
                        <button onClick={() => { setEditingId(null); load(); }} className="btn-ghost p-1.5">
                          <X size={13} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditingId(memo.id)} className="btn-ghost p-1.5">
                          <Edit3 size={13} />
                        </button>
                        <button onClick={() => handleDelete(memo.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-600">
                          <Trash2 size={13} />
                        </button>
                      </>
                    )
                  )}
                  {expandedId === memo.id ? <ChevronUp size={14} className="text-surface-400" /> : <ChevronDown size={14} className="text-surface-400" />}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === memo.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 border-t border-surface-100 pt-2">
                    {editingId === memo.id ? (
                      <textarea
                        value={memo.description || ''}
                        onChange={e => updateLocal(memo.id, 'description', e.target.value)}
                        className="textarea text-sm w-full"
                        rows={4}
                        placeholder="Description..."
                      />
                    ) : (
                      <p className="text-xs text-surface-500 whitespace-pre-wrap leading-relaxed">
                        {memo.description || <span className="italic text-surface-400">No description</span>}
                      </p>
                    )}
                    <p className="text-[10px] text-surface-300 mt-2">
                      {memo.attachments?.length || 0} attachment(s) · Created {new Date(memo.createdAt).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
