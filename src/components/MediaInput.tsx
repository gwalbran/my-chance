import { Button, Tag } from '@blueprintjs/core';
import { useRef } from 'react';
import { useObjectUrl } from '../hooks/useObjectUrl';
import type { MediaAsset } from '../types';

interface Props {
  type: 'image' | 'sound';
  value: MediaAsset | undefined;
  onChange: (asset: MediaAsset | undefined) => void;
}

export function MediaInput({ type, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useObjectUrl(value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please use a file under 20 MB.`);
      return;
    }
    onChange({ blob: file, mimeType: file.type, name: file.name });
    if (inputRef.current) inputRef.current.value = '';
  };

  const accept = type === 'image' ? 'image/*' : 'audio/*';
  const label = type === 'image' ? 'Image' : 'Sound';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        small
        minimal
        icon={type === 'image' ? 'media' : 'volume-up'}
        onClick={() => inputRef.current?.click()}
      >
        {value ? 'Change' : `Add ${label}`}
      </Button>

      {value && (
        <>
          {type === 'image' && previewUrl && (
            <img
              src={previewUrl}
              alt={value.name}
              style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: 3, border: '1px solid #555' }}
            />
          )}
          {type === 'sound' && (
            <Tag minimal icon="volume-up" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {value.name}
            </Tag>
          )}
          <Button small minimal icon="cross" intent="danger" onClick={() => onChange(undefined)} />
        </>
      )}
    </div>
  );
}
