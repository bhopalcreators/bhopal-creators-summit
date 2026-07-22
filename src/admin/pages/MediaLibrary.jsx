import { useCallback, useEffect, useRef, useState } from 'react';
import { UploadCloud, Trash2, Loader2, Copy } from 'lucide-react';
import adminApi from '../lib/adminApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

export default function MediaLibrary() {
  const { can } = useAuth();
  const { push } = useToast();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const inputRef = useRef(null);

  const canDelete = can('media', 'delete');
  const canCreate = can('media', 'create');

  const load = useCallback(async (cursor) => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/uploads?maxResults=40${cursor ? `&nextCursor=${cursor}` : ''}`);
      setAssets((prev) => (cursor ? [...prev, ...res.assets] : res.assets));
      setNextCursor(res.nextCursor);
    } catch (err) {
      push(err.message || 'Failed to load media.', 'error');
    } finally {
      setLoading(false);
    }
  }, [push]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      [...files].forEach((f) => formData.append('files', f));
      formData.append('folder', 'general');
      await adminApi.upload('/uploads/bulk', formData);
      push(`Uploaded ${files.length} file(s).`);
      load();
    } catch (err) {
      push(err.message || 'Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.post('/uploads/delete', {
        publicId: pendingDelete.publicId,
        resourceType: pendingDelete.type,
      });
      push('Deleted from Cloudinary.');
      setAssets((prev) => prev.filter((a) => a.publicId !== pendingDelete.publicId));
      setPendingDelete(null);
    } catch (err) {
      push(err.message || 'Delete failed.', 'error');
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard?.writeText(url);
    push('URL copied.');
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl uppercase text-bone">Media Library</h1>
        {canCreate && (
          <>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="focus-flare flex items-center gap-2 rounded-full bg-flare px-5 py-2.5 text-sm font-bold text-ink hover:bg-flare-hot disabled:opacity-60"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
              {uploading ? 'Uploading…' : 'Bulk upload'}
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </>
        )}
      </div>

      {loading && assets.length === 0 && <p className="text-fog">Loading…</p>}
      {!loading && assets.length === 0 && (
        <p className="text-fog">
          No media uploaded yet. Uploads made through any content form (or the button above) will show up here.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {assets.map((a) => (
          <div key={a.publicId} className="group relative overflow-hidden rounded-xl border border-panel-line bg-panel">
            {a.type === 'video' ? (
              <video src={a.url} className="aspect-square w-full object-cover" muted />
            ) : (
              <img src={a.url} alt="" className="aspect-square w-full object-cover" />
            )}
            <div className="absolute inset-0 flex items-end justify-end gap-1 bg-black/0 p-2 opacity-0 transition group-hover:bg-black/50 group-hover:opacity-100">
              <button
                onClick={() => copyUrl(a.url)}
                className="focus-flare rounded-full bg-panel/90 p-1.5 text-bone hover:text-flare"
                aria-label="Copy URL"
              >
                <Copy size={14} />
              </button>
              {canDelete && (
                <button
                  onClick={() => setPendingDelete(a)}
                  className="focus-flare rounded-full bg-panel/90 p-1.5 text-bone hover:text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {nextCursor && (
        <div className="mt-6 text-center">
          <button
            onClick={() => load(nextCursor)}
            disabled={loading}
            className="focus-flare rounded-full border border-panel-line px-5 py-2.5 text-sm font-semibold text-bone hover:border-fog disabled:opacity-60"
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this media?"
        message="This permanently removes the file from Cloudinary. If it's used on a live page, that image/video will break."
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
