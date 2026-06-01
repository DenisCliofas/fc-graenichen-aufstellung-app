import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './PhotoCropper.css';

interface Props {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
  existingPhoto?: string;
}

const MIN_SIZE = 60;

export default function PhotoCropper({ onSave, onCancel, existingPhoto }: Props) {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState<string | null>(existingPhoto ?? null);
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 200 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ type: 'move' | 'resize'; startX: number; startY: number; origCrop: typeof crop } | null>(null);

  const handleImageLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const { width, height } = img.getBoundingClientRect();
    const size = Math.round(Math.min(width, height) * 0.7);
    setCrop({ x: Math.round((width - size) / 2), y: Math.round((height - size) / 2), size });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImgSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clamp = useCallback((c: typeof crop) => {
    const img = imgRef.current;
    if (!img) return c;
    const { width, height } = img.getBoundingClientRect();
    const size = Math.max(MIN_SIZE, Math.min(c.size, width, height));
    const x = Math.max(0, Math.min(c.x, width - size));
    const y = Math.max(0, Math.min(c.y, height - size));
    return { x, y, size };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent, type: 'move' | 'resize') => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { type, startX: e.clientX, startY: e.clientY, origCrop: { ...crop } };
  }, [crop]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current) return;
    const { type, startX, startY, origCrop } = dragState.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (type === 'move') {
      setCrop(clamp({ ...origCrop, x: origCrop.x + dx, y: origCrop.y + dy }));
    } else {
      const delta = Math.round((dx + dy) / 2);
      setCrop(clamp({ ...origCrop, size: Math.max(MIN_SIZE, origCrop.size + delta) }));
    }
  }, [clamp]);

  const onPointerUp = useCallback(() => { dragState.current = null; }, []);

  const handleSave = () => {
    const img = imgRef.current;
    if (!img || !imgSrc) return;
    const { width: displayW, height: displayH } = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / displayW;
    const scaleY = img.naturalHeight / displayH;
    const canvas = document.createElement('canvas');
    const OUTPUT = 400;
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(
      img,
      crop.x * scaleX, crop.y * scaleY,
      crop.size * scaleX, crop.size * scaleY,
      0, 0, OUTPUT, OUTPUT
    );
    onSave(canvas.toDataURL('image/jpeg', 0.85));
  };

  useEffect(() => {
    const handler = () => setCrop(c => clamp(c));
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [clamp]);

  return (
    <div className="photo-cropper-overlay">
      <div className="photo-cropper-modal">
        <div className="photo-cropper-header">
          <span className="photo-cropper-title">{t('photo_cropper_title')}</span>
          <button className="photo-cropper-close" onClick={onCancel}>✕</button>
        </div>

        {!imgSrc ? (
          <div className="photo-cropper-upload">
            <label className="photo-upload-btn">
              {t('photo_select')}
              <input type="file" accept="image/*" onChange={handleFile} hidden />
            </label>
            <p className="photo-upload-hint">{t('photo_upload_hint')}</p>
          </div>
        ) : (
          <>
            <div
              className="photo-cropper-canvas"
              ref={containerRef}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt=""
                className="photo-cropper-img"
                onLoad={handleImageLoad}
                draggable={false}
              />
              <div className="photo-cropper-overlay-top"    style={{ height: crop.y }} />
              <div className="photo-cropper-overlay-bottom" style={{ top: crop.y + crop.size }} />
              <div className="photo-cropper-overlay-left"   style={{ top: crop.y, height: crop.size, width: crop.x }} />
              <div className="photo-cropper-overlay-right"  style={{ top: crop.y, height: crop.size, left: crop.x + crop.size }} />

              <div
                className="photo-crop-box"
                style={{ left: crop.x, top: crop.y, width: crop.size, height: crop.size }}
                onPointerDown={e => onPointerDown(e, 'move')}
              >
                <div className="crop-grid-h crop-grid-1" />
                <div className="crop-grid-h crop-grid-2" />
                <div className="crop-grid-v crop-grid-1" />
                <div className="crop-grid-v crop-grid-2" />
                <div
                  className="crop-resize-handle"
                  onPointerDown={e => { e.stopPropagation(); onPointerDown(e, 'resize'); }}
                />
              </div>
            </div>

            <div className="photo-cropper-footer">
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                {t('photo_change_file')}
                <input type="file" accept="image/*" onChange={handleFile} hidden />
              </label>
              <button className="btn btn-primary" onClick={handleSave}>
                {t('photo_crop_save')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
