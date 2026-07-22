import { useRef, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import adminApi from '../lib/adminApi';
import { useToast } from './Toast';

export default function MediaField({ label, value, onChange, folder = 'general' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { push } = useToast();

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const res = await adminApi.upload('/uploads/single', formData);
      onChange(res.asset);
    } catch (err) {
      push(err.message || 'Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value?.publicId) {
      try {
        await adminApi.post('/uploads/delete', {
          publicId: value.publicId,
          resourceType: value.type === 'video' ? 'video' : 'image',
        });
      } catch (err) {
        push(err.message || 'Could not delete from Cloudinary — removing from this field anyway.', 'error');
      }
    }
    onChange(null);
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fog">{label}</label>

      {value?.url ? (
        <div className="flex items-center gap-3 rounded-lg border border-panel-line bg-charcoal p-3">
          {value.type === 'video' ? (
            <video src={value.url} className="h-16 w-16 rounded object-cover" muted />
          ) : (
            <img src={value.url} alt="" className="h-16 w-16 rounded object-cover" />
          )}
          <p className="flex-1 truncate text-xs text-fog">{value.publicId}</p>
          <button type="button" onClick={handleRemove} className="focus-flare text-fog hover:text-red-400" aria-label="Remove media">
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="focus-flare flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-panel-line bg-charcoal py-6 text-sm text-fog hover:border-flare hover:text-flare disabled:opacity-60"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          {uploading ? 'Uploading…' : 'Click to upload image or video'}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
