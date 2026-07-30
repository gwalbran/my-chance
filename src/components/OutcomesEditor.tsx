import { Button, H5 } from '@blueprintjs/core';
import type { Outcome } from '../types';
import { OutcomeRow } from './OutcomeRow';

interface Props {
  outcomes: Outcome[];
  onChange: (outcomes: Outcome[]) => void;
  showErrors: boolean;
}

export function OutcomesEditor({ outcomes, onChange, showErrors }: Props) {
  const addOutcome = () => {
    onChange([
      ...outcomes,
      { id: crypto.randomUUID(), label: '', occurrences: 1 },
    ]);
  };

  const updateOutcome = (index: number, updated: Outcome) => {
    onChange(outcomes.map((o, i) => (i === index ? updated : o)));
  };

  const removeOutcome = (index: number) => {
    onChange(outcomes.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <H5 style={{ margin: 0 }}>Outcomes</H5>
        <Button small icon="add" onClick={addOutcome}>Add Outcome</Button>
      </div>

      {showErrors && outcomes.length === 0 && (
        <p style={{ color: '#cd4246', fontSize: 13, margin: '0 0 8px' }}>
          At least one outcome is required.
        </p>
      )}

      {outcomes.map((outcome, index) => (
        <OutcomeRow
          key={outcome.id}
          outcome={outcome}
          onChange={updated => updateOutcome(index, updated)}
          onRemove={() => removeOutcome(index)}
          showError={showErrors}
        />
      ))}

      {outcomes.length === 0 && (
        <p style={{ color: '#8a9ba8', fontSize: 13, fontStyle: 'italic' }}>
          No outcomes yet. Add one above.
        </p>
      )}
    </div>
  );
}
