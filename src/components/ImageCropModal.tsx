'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Crop, Loader2 } from 'lucide-react';

interface Props {
  src: string;
  onCrop: (blob: Blob) => void;
  onClose: () => void;
}

export function ImageCropModal({ src, onCrop, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });

  const [loaded, setLoaded] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const img = el;
    function onLoad() {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const maxDim = 400;
      const scale = Math.min(maxDim / w, maxDim / h, 1);
      const dw = Math.round(w * scale);
      const dh = Math.round(h * scale);
      setDims({ w: dw, h: dh });
      setOffset({ x: 0, y: 0 });
      setLoaded(true);
    }
    if (img.complete) onLoad();
    else img.addEventListener('load', onLoad);
    return () => img.removeEventListener('load', onLoad);
  }, [src]);

  const size = loaded ? Math.min(dims.w, dims.h) : 0;

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    dragRef.current = true;
    dragStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragRef.current) return;
    const maxX = dims.w - size;
    const maxY = dims.h - size;
    const newOffset = {
      x: Math.max(0, Math.min(maxX, e.clientX - dragStartRef.current.x)),
      y: Math.max(0, Math.min(maxY, e.clientY - dragStartRef.current.y)),
    };
    offsetRef.current = newOffset;
    setOffset(newOffset);
  }

  function handleMouseUp() {
    dragRef.current = false;
  }

  async function handleConfirm() {
    const img = imgRef.current;
    if (!img || !loaded) return;
    setSaving(true);
    setError('');

    await new Promise(r => requestAnimationFrame(r));

    try {
      const o = offsetRef.current;
      const sx = img.naturalWidth / dims.w;
      const sy = img.naturalHeight / dims.h;
      const cw = Math.round(size * sx);
      const ch = Math.round(size * sy);

      const canvas = document.createElement('canvas');
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(
        img,
        Math.round(o.x * sx), Math.round(o.y * sy),
        cw, ch,
        0, 0,
        cw, ch,
      );

      canvas.toBlob(blob => {
        if (blob) onCrop(blob);
        else setError('Failed to create image. Try a different photo.');
        setSaving(false);
      }, 'image/webp', 0.85);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Crop failed');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-background border border-border rounded-lg p-4 sm:p-6 max-w-lg w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Crop size={16} />
            Crop Profile Image
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div
          ref={containerRef}
          className="relative mx-auto overflow-hidden rounded-lg"
          style={{ width: dims.w || 300, height: dims.h || 300 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imgRef}
            src={src}
            alt="Crop"
            className="absolute top-0 left-0 max-w-none pointer-events-none"
            style={{ width: dims.w || 'auto', height: dims.h || 'auto' }}
            draggable={false}
            crossOrigin="anonymous"
          />
          {loaded && (
            <div
              className="absolute border-2 border-accent ring-1 ring-white/30 cursor-move pointer-events-none"
              style={{
                width: size,
                height: size,
                left: offset.x,
                top: offset.y,
              }}
            />
          )}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center text-muted text-sm gap-2">
              <Loader2 size={16} className="animate-spin" />
              Loading image...
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
        )}

        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!loaded || saving}
            className="px-3 py-1.5 text-sm rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Saving...' : 'Crop & Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
