// src/components/CreateEntryModal.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  X, ChevronDown, Upload, FileText, ImageIcon, AlertCircle,
  CheckCircle2, Hash, Building2, ArrowRight, FileCheck2, Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { entryApi } from '../utils/api';
import { formatDisplay } from '../utils/dateHelpers';

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 mt-1 text-[11px] text-red-500"
    >
      <AlertCircle size={10} /> {msg}
    </motion.p>
  );
}

function Label({ children, required }) {
  return (
    <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
      {children}
      {required && <span className="text-red-400">*</span>}
    </label>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i < current ? 'bg-indigo-500 w-6' : i === current ? 'bg-indigo-400 w-4' : 'bg-slate-200 w-2'
          }`}
        />
      ))}
    </div>
  );
}

// ─── SL Number Selector ───────────────────────────────────────────────────────
function SlSelector({ value, onChange, slOptions, error }) {
  const [mode, setMode] = useState('select'); // 'select' | 'manual'
  const [open, setOpen] = useState(false);
  const [manualVal, setManualVal] = useState('');
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allOptions = [
    ...(slOptions?.gaps?.map((v) => ({ value: v, label: `#${v}`, tag: 'Gap' })) || []),
    ...(slOptions?.nextSlots?.map((v) => ({ value: v, label: `#${v}`, tag: v === slOptions?.nextAvailable ? 'Next' : '' })) || []),
  ];

  const selected = allOptions.find((o) => o.value === value);

  return (
    <div>
      <Label required>SL Number</Label>

      {/* Toggle */}
      <div className="flex gap-2 mb-2">
        {['select', 'manual'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); onChange(''); }}
            className={`text-[11px] px-2.5 py-1 rounded-full transition-all font-medium ${
              mode === m ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {m === 'select' ? 'Choose from list' : 'Enter manually'}
          </button>
        ))}
      </div>

      {mode === 'select' ? (
        <div className="relative" ref={dropRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm transition-all ${
              error
                ? 'border-red-300 bg-red-50'
                : open
                ? 'border-indigo-400 ring-2 ring-indigo-100 bg-white'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className={value ? 'text-slate-800 font-medium' : 'text-slate-400'}>
              {selected ? `SL No. ${selected.value}` : 'Select SL number…'}
            </span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto"
              >
                {slOptions?.gaps?.length > 0 && (
                  <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-100">
                    <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">Unused Gap Numbers</p>
                  </div>
                )}
                {slOptions?.gaps?.map((v) => (
                  <button
                    key={`gap-${v}`}
                    type="button"
                    onClick={() => { onChange(v); setOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-amber-50 text-sm"
                  >
                    <span className="font-medium text-slate-700">SL No. {v}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">Gap</span>
                  </button>
                ))}
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 sticky top-0">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Next Available</p>
                </div>
                {slOptions?.nextSlots?.map((v) => (
                  <button
                    key={`next-${v}`}
                    type="button"
                    onClick={() => { onChange(v); setOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                      v === slOptions?.nextAvailable ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`font-medium ${v === slOptions?.nextAvailable ? 'text-indigo-700' : 'text-slate-700'}`}>
                      SL No. {v}
                    </span>
                    {v === slOptions?.nextAvailable && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                        Recommended
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <input
          type="number"
          min={1}
          value={manualVal}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            setManualVal(e.target.value);
            if (v > 0) onChange(v);
          }}
          placeholder="Enter SL number…"
          className={`w-full px-3 py-2.5 rounded-xl border text-sm transition-all outline-none ${
            error
              ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100'
              : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
          }`}
        />
      )}
      <FieldError msg={error} />
    </div>
  );
}

// ─── File Dropzone ────────────────────────────────────────────────────────────
function FileDropzone({ file, onChange, error }) {
  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error(rejected[0].errors[0].message || 'File rejected');
      return;
    }
    if (accepted.length > 0) onChange(accepted[0]);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 15 * 1024 * 1024,
    multiple: false,
  });

  const isPDF = file?.type === 'application/pdf';

  return (
    <div>
      <Label>Attachment (PDF / Image)</Label>
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-indigo-400 bg-indigo-50'
            : file
            ? 'border-emerald-300 bg-emerald-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/30'
        }`}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="flex items-center gap-3 w-full">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPDF ? 'bg-red-100' : 'bg-blue-100'}`}>
              {isPDF ? <FileText size={18} className="text-red-600" /> : <ImageIcon size={18} className="text-blue-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="p-1 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X size={14} className="text-red-400" />
            </button>
          </div>
        ) : (
          <>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDragActive ? 'bg-indigo-100' : 'bg-white border border-slate-200'}`}>
              <Upload size={18} className={isDragActive ? 'text-indigo-600' : 'text-slate-400'} />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500">
                {isDragActive ? 'Drop it here' : <>Drag & drop or <span className="text-indigo-600 font-medium">browse</span></>}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">PDF, JPG, PNG, WEBP — max 15 MB</p>
            </div>
          </>
        )}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
const STEPS = ['Identifiers', 'Companies', 'Details'];

const initialForm = {
  slNo: '',
  senderName: '',
  senderCode: '',
  receiverName: '',
  receiverCode: '',
  purpose: '',
  description: '',
  sendCount: '1',
};

export default function CreateEntryModal({ date, onClose, onSuccess }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [slOptions, setSlOptions] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMemo, setPreviewMemo] = useState('');

  // Fetch SL options on mount
  useEffect(() => {
    entryApi.getSlOptions().then((r) => setSlOptions(r.data)).catch(() => {});
  }, []);

  // Preview memo number as user types
  useEffect(() => {
    if (form.slNo && form.senderCode) {
      const year = new Date(date).getFullYear();
      const sl = String(form.slNo).padStart(4, '0');
      const code = form.senderCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
      setPreviewMemo(`MEMO-${year}-${sl}-${code}-??`);
    } else {
      setPreviewMemo('');
    }
  }, [form.slNo, form.senderCode, date]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  // ── Step validation ──────────────────────────────────────────────────────────
  const validateStep = (s) => {
    const errs = {};
    if (s === 0) {
      if (!form.slNo) errs.slNo = 'SL number is required';
    }
    if (s === 1) {
      if (!form.senderName.trim()) errs.senderName = 'Required';
      if (!form.senderCode.trim()) errs.senderCode = 'Required';
      if (!form.receiverName.trim()) errs.receiverName = 'Required';
      if (!form.receiverCode.trim()) errs.receiverCode = 'Required';
      if (form.senderCode.trim().toUpperCase() === form.receiverCode.trim().toUpperCase()) {
        errs.receiverCode = 'Receiver code must differ from sender code';
      }
    }
    if (s === 2) {
      if (!form.purpose.trim()) errs.purpose = 'Required';
      if (!form.description.trim()) errs.description = 'Required';
      if (!form.sendCount || parseInt(form.sendCount) < 1) errs.sendCount = 'Must be at least 1';
    }
    return errs;
  };

  const goNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => s - 1);

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStep(2);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('date', date);
      if (file) fd.append('file', file);

      const res = await entryApi.create(fd);
      toast.success(`Entry created — ${res.data.entry.memoNumber}`);
      onSuccess?.(res.data.entry);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create entry';
      const details = err.response?.data?.details;
      if (details) {
        const fieldErrs = {};
        Object.entries(details).forEach(([k, v]) => { fieldErrs[k] = v[0]; });
        setErrors(fieldErrs);
        // Go back to the step that has the error
        if (fieldErrs.slNo) setStep(0);
        else if (fieldErrs.senderName || fieldErrs.senderCode || fieldErrs.receiverName || fieldErrs.receiverCode) setStep(1);
        else setStep(2);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Keyboard shortcut ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const inputClass = (field) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all ${
      errors[field]
        ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100'
        : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">New Entry</h2>
              <p className="text-xs text-slate-400 mt-0.5">{formatDisplay(date)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>

          {/* Memo preview */}
          {previewMemo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 px-3 py-2 bg-indigo-50 rounded-xl flex items-center gap-2"
            >
              <Hash size={12} className="text-indigo-500 flex-shrink-0" />
              <span className="font-mono text-xs text-indigo-700 font-medium">{previewMemo}</span>
              <span className="text-[10px] text-indigo-400 ml-auto">Preview</span>
            </motion.div>
          )}

          {/* Step indicator */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <span
                  key={s}
                  className={`text-[11px] font-medium ${i === step ? 'text-indigo-600' : i < step ? 'text-slate-400' : 'text-slate-300'}`}
                >
                  {i < step ? '✓' : `${i + 1}.`} {s}
                </span>
              ))}
            </div>
            <StepIndicator current={step} total={STEPS.length} />
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <AnimatePresence mode="wait">
              {/* ── Step 0: SL Number ── */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <SlSelector
                    value={form.slNo}
                    onChange={(v) => set('slNo', v)}
                    slOptions={slOptions}
                    error={errors.slNo}
                  />

                  {slOptions && (
                    <div className="flex gap-3 mt-2">
                      <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-bold text-slate-800">{slOptions.usedCount}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Used</p>
                      </div>
                      <div className="flex-1 bg-amber-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-bold text-amber-700">{slOptions.gaps?.length}</p>
                        <p className="text-[10px] text-amber-500 mt-0.5">Gaps</p>
                      </div>
                      <div className="flex-1 bg-indigo-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-bold text-indigo-700">{slOptions.nextAvailable}</p>
                        <p className="text-[10px] text-indigo-400 mt-0.5">Next SL</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── Step 1: Companies ── */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  {/* Sender */}
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <Building2 size={11} className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-blue-700">Sending Company</span>
                    </div>
                    <div>
                      <Label required>Company Name</Label>
                      <input
                        value={form.senderName}
                        onChange={(e) => set('senderName', e.target.value)}
                        className={inputClass('senderName')}
                        placeholder="e.g. Acme Corporation"
                        autoFocus
                      />
                      <FieldError msg={errors.senderName} />
                    </div>
                    <div>
                      <Label required>Company Code</Label>
                      <input
                        value={form.senderCode}
                        onChange={(e) => set('senderCode', e.target.value.toUpperCase())}
                        className={inputClass('senderCode') + ' font-mono uppercase'}
                        placeholder="e.g. ACME"
                        maxLength={20}
                      />
                      <FieldError msg={errors.senderCode} />
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <ArrowRight size={14} className="text-slate-500" />
                    </div>
                  </div>

                  {/* Receiver */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Building2 size={11} className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-emerald-700">Receiving Company</span>
                    </div>
                    <div>
                      <Label required>Company Name</Label>
                      <input
                        value={form.receiverName}
                        onChange={(e) => set('receiverName', e.target.value)}
                        className={inputClass('receiverName')}
                        placeholder="e.g. Global Partners Ltd."
                      />
                      <FieldError msg={errors.receiverName} />
                    </div>
                    <div>
                      <Label required>Company Code</Label>
                      <input
                        value={form.receiverCode}
                        onChange={(e) => set('receiverCode', e.target.value.toUpperCase())}
                        className={inputClass('receiverCode') + ' font-mono uppercase'}
                        placeholder="e.g. GLPL"
                        maxLength={20}
                      />
                      <FieldError msg={errors.receiverCode} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Details ── */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div>
                    <Label required>Purpose</Label>
                    <input
                      value={form.purpose}
                      onChange={(e) => set('purpose', e.target.value)}
                      className={inputClass('purpose')}
                      placeholder="e.g. Contract renewal, Invoice dispatch…"
                      autoFocus
                    />
                    <FieldError msg={errors.purpose} />
                  </div>

                  <div>
                    <Label required>Description</Label>
                    <textarea
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      className={inputClass('description') + ' resize-none'}
                      rows={4}
                      placeholder="Detailed description of this memo…"
                    />
                    <FieldError msg={errors.description} />
                  </div>

                  <div>
                    <Label required>Number of Times Sending</Label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => set('sendCount', String(Math.max(1, parseInt(form.sendCount || 1) - 1)))}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                      >−</button>
                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={form.sendCount}
                        onChange={(e) => set('sendCount', e.target.value)}
                        className={`flex-1 text-center font-semibold ${inputClass('sendCount')}`}
                      />
                      <button
                        type="button"
                        onClick={() => set('sendCount', String(Math.min(999, parseInt(form.sendCount || 1) + 1)))}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                      >+</button>
                    </div>
                    <FieldError msg={errors.sendCount} />
                  </div>

                  <FileDropzone file={file} onChange={setFile} error={errors.file} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
            <div>
              {step > 0 && (
                <button type="button" onClick={goBack} className="btn-ghost text-sm">
                  ← Back
                </button>
              )}
            </div>

            <div>
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={goNext} className="btn-primary">
                  Continue →
                </button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
                >
                  {isSubmitting ? (
                    <><Loader2 size={14} className="animate-spin" /> Creating…</>
                  ) : (
                    <><FileCheck2 size={14} /> Create Entry</>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
