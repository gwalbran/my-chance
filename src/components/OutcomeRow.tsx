import { Button, Classes, Dialog, FormGroup, InputGroup, NumericInput, TextArea } from '@blueprintjs/core';
import { useRef, useState } from 'react';
import type { MediaAsset, Outcome } from '../types';
import { HelpTip } from './HelpTip';
import { MediaInput } from './MediaInput';
import { OutcomeReveal } from './OutcomeReveal';

interface Props {
  outcome: Outcome;
  onChange: (updated: Outcome) => void;
  onRemove: () => void;
  showError: boolean;
}

export function OutcomeRow({ outcome, onChange, onRemove, showError }: Props) {
  const update = (patch: Partial<Outcome>) => onChange({ ...outcome, ...patch });
  const [previewOpen, setPreviewOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePreview = () => {
    if (outcome.sound) {
      const url = URL.createObjectURL(outcome.sound.blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play().catch(() => null).finally(() => URL.revokeObjectURL(url));
    }
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setPreviewOpen(false);
  };

  return (
    <div style={{
      border: '1px solid #394b59',
      borderRadius: 4,
      padding: 12,
      marginBottom: 8,
      background: '#293742',
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <FormGroup
          label="Label"
          labelInfo={<HelpTip content="The name shown when this outcome is drawn." />}
          style={{ flex: '2 1 160px', marginBottom: 0 }}
          intent={showError && !outcome.label.trim() ? 'danger' : 'none'}
          helperText={showError && !outcome.label.trim() ? 'Required' : undefined}
        >
          <InputGroup
            value={outcome.label}
            onChange={e => update({ label: e.target.value })}
            intent={showError && !outcome.label.trim() ? 'danger' : 'none'}
            placeholder="e.g. Red"
          />
        </FormGroup>

        <FormGroup
          label="Description"
          labelInfo={<HelpTip content="Optional. Shown as extra detail below the label when this outcome is drawn." />}
          style={{ flex: '3 1 200px', marginBottom: 0 }}
        >
          <TextArea
            value={outcome.description ?? ''}
            onChange={e => update({ description: e.target.value || undefined })}
            rows={1}
            style={{ resize: 'vertical', minHeight: 30 }}
            fill
          />
        </FormGroup>

        <FormGroup
          label="Occurrences"
          labelInfo={<HelpTip content="How many times this outcome goes into the bucket. An outcome with 3 occurrences is three times as likely to be drawn as one with 1." />}
          style={{ flex: '0 0 120px', marginBottom: 0 }}
        >
          <NumericInput
            value={outcome.occurrences}
            onValueChange={val => update({ occurrences: Math.max(1, Math.floor(val || 1)) })}
            min={1}
            stepSize={1}
            clampValueOnBlur
            fill
          />
        </FormGroup>

        <div style={{ display: 'flex', gap: 4, marginTop: 22 }}>
          <Button
            minimal
            icon="eye-open"
            title="Preview outcome"
            onClick={handlePreview}
          />
          <Button
            minimal
            icon="trash"
            intent="danger"
            title="Remove outcome"
            onClick={onRemove}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 8, flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: 12, color: '#8a9ba8', marginRight: 4 }}>Image</span>
          <HelpTip content="Optional. Shown when this outcome is drawn." />
          <span style={{ marginRight: 8 }}>:</span>
          <MediaInput
            type="image"
            value={outcome.image}
            onChange={(asset: MediaAsset | undefined) => update({ image: asset })}
          />
        </div>
        <div>
          <span style={{ fontSize: 12, color: '#8a9ba8', marginRight: 4 }}>Sound</span>
          <HelpTip content="Optional. Played when this outcome is drawn." />
          <span style={{ marginRight: 8 }}>:</span>
          <MediaInput
            type="sound"
            value={outcome.sound}
            onChange={(asset: MediaAsset | undefined) => update({ sound: asset })}
          />
        </div>
      </div>

      <Dialog
        isOpen={previewOpen}
        onClose={handleClosePreview}
        title={`Preview — ${outcome.label || 'Untitled'}`}
        style={{ width: 'auto', maxWidth: 540 }}
      >
        <div className={Classes.DIALOG_BODY}>
          <OutcomeReveal outcome={outcome} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClosePreview}>Close</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
