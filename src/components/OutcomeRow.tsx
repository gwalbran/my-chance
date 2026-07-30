import { Button, FormGroup, InputGroup, NumericInput, TextArea } from '@blueprintjs/core';
import type { Outcome } from '../types';
import { MediaInput } from './MediaInput';
import type { MediaAsset } from '../types';

interface Props {
  outcome: Outcome;
  onChange: (updated: Outcome) => void;
  onRemove: () => void;
  showError: boolean;
}

export function OutcomeRow({ outcome, onChange, onRemove, showError }: Props) {
  const update = (patch: Partial<Outcome>) => onChange({ ...outcome, ...patch });

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

        <FormGroup label="Description" style={{ flex: '3 1 200px', marginBottom: 0 }}>
          <TextArea
            value={outcome.description ?? ''}
            onChange={e => update({ description: e.target.value || undefined })}
            rows={1}
            style={{ resize: 'vertical', minHeight: 30 }}
            fill
          />
        </FormGroup>

        <FormGroup label="Occurrences" style={{ flex: '0 0 100px', marginBottom: 0 }}>
          <NumericInput
            value={outcome.occurrences}
            onValueChange={val => update({ occurrences: Math.max(1, Math.floor(val || 1)) })}
            min={1}
            stepSize={1}
            clampValueOnBlur
            fill
          />
        </FormGroup>

        <Button
          minimal
          icon="trash"
          intent="danger"
          style={{ marginTop: 22 }}
          onClick={onRemove}
          title="Remove outcome"
        />
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 8, flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: 12, color: '#8a9ba8', marginRight: 8 }}>Image:</span>
          <MediaInput
            type="image"
            value={outcome.image}
            onChange={(asset: MediaAsset | undefined) => update({ image: asset })}
          />
        </div>
        <div>
          <span style={{ fontSize: 12, color: '#8a9ba8', marginRight: 8 }}>Sound:</span>
          <MediaInput
            type="sound"
            value={outcome.sound}
            onChange={(asset: MediaAsset | undefined) => update({ sound: asset })}
          />
        </div>
      </div>
    </div>
  );
}
