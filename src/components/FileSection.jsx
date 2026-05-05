// src/components/FileSection.jsx
import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Trash2, Eye, Upload, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { fileApi } from '../utils/api';
import { formatFileSize, isLocked } from '../utils/dateHelpers';

export default function FileSection({ date, locked, onChange }) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await fileApi.getByDate(date);
      setFiles(res.data.files);
    } catch {
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, [date]);

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected.length > 0) {
      const reasons = rejected.map(r => r.errors.map(e => e.message).join(', ')).join('; ');
      toast.error(`Rejected: ${reasons}`);
      return;
    }
    if (accepted.length === 0) return;

    setIsUploading(true);
    for (const file of accepted) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('date', date);
        await fileApi.upload(formData);
        toast.success(`${file.name} uploaded`);
      } catch (err) {
        toast.error(err.response?.data?.error || `Failed to upload ${file.name}`);
      }
    }
    setIsUploading(false);
    load();
    onChange?.();
  }, [date]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    disabled: locked || isUploading,
    multiple: true,
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this file?')) return;
    try {
      await fileApi.delete(id);
      toast.success('File deleted');
      load();
      onChange?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleView = (id) => {
    window.open(fileApi.getUrl(id), '_blank');
  };

  if (isLoading) return <div className="text-center py-8 text-surface-400 text-sm">Loading...</div>;

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {!locked && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-accent-400 bg-accent-50'
              : 'border-surface-200 hover:border-accent-300 hover:bg-surface-50'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload size={20} className={`mx-auto mb-2 ${isDragActive ? 'text-accent-600' : 'text-surface-300'}`} />
          {isUploading ? (
            <p className="text-sm text-surface-500">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-sm text-accent-600 font-medium">Drop PDF here</p>
          ) : (
            <>
              <p className="text-sm text-surface-500">Drag & drop PDFs or <span className="text-accent-600 font-medium">browse</span></p>
              <p className="text-xs text-surface-400 mt-1">PDF only · Max 10MB</p>
            </>
          )}
        </div>
      )}

      {files.length === 0 && (
        <p className="text-center py-6 text-surface-400 text-sm">No documents for this date</p>
      )}

      <div className="space-y-2">
        {files.map(file => (
          <div key={file.id} className="bg-white rounded-xl border border-surface-200 p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-800 truncate">{file.originalName}</p>
              <p className="text-xs text-surface-400">
                {formatFileSize(file.size)} · {new Date(file.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => handleView(file.id)} className="btn-ghost p-1.5" title="View">
                <Eye size={13} />
              </button>
              {!locked && !isLocked(file.linkedDate) && (
                <button onClick={() => handleDelete(file.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-600" title="Delete">
                  <Trash2 size={13} />
                </button>
              )}
              {(locked || isLocked(file.linkedDate)) && (
                <Lock size={12} className="text-amber-500 ml-1" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
