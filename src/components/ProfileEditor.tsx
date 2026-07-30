import {
  Button,
  Divider,
  FormGroup,
  H3,
  HTMLSelect,
  InputGroup,
  TextArea,
} from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import { put } from '../persistence/profileRepo';
import { useStore } from '../state/store';
import type { GameMode, Outcome, Profile } from '../types';
import { showToast } from '../util/toaster';
import { OutcomesEditor } from './OutcomesEditor';

export function ProfileEditor() {
  const { state, dispatch } = useStore();
  const view = state.view;
  if (view.name !== 'editor') return null;

  const existingProfile =
    view.profileId != null ? state.profiles.find(p => p.id === view.profileId) : undefined;

  const [name, setName] = useState(existingProfile?.name ?? '');
  const [description, setDescription] = useState(existingProfile?.description ?? '');
  const [mode, setMode] = useState<GameMode>(existingProfile?.mode ?? 'roulette');
  const [outcomes, setOutcomes] = useState<Outcome[]>(existingProfile?.outcomes ?? []);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (existingProfile) {
      setName(existingProfile.name);
      setDescription(existingProfile.description ?? '');
      setMode(existingProfile.mode);
      setOutcomes(existingProfile.outcomes);
    }
  }, [view.profileId]);

  const nameError = (() => {
    if (!name.trim()) return 'Name is required.';
    const duplicate = state.profiles.find(
      p => p.name.trim().toLowerCase() === name.trim().toLowerCase() && p.id !== view.profileId
    );
    if (duplicate) return 'A profile with this name already exists.';
    return null;
  })();

  const outcomesError =
    outcomes.length === 0 || outcomes.some(o => !o.label.trim())
      ? 'All outcomes must have a label.'
      : null;

  const handleSave = async () => {
    setSubmitted(true);
    if (nameError || outcomesError) return;

    const now = Date.now();
    const profile: Profile = {
      id: view.profileId ?? crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      mode,
      outcomes,
      createdAt: existingProfile?.createdAt ?? now,
      updatedAt: now,
    };

    try {
      await put(profile);
      dispatch({ type: 'PROFILE_SAVED', profile });
      dispatch({ type: 'NAVIGATE', view: { name: 'list' } });
      showToast(existingProfile ? 'Profile updated.' : 'Profile created.', 'success');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        showToast('Storage quota exceeded. Try removing large media files.', 'danger');
      } else {
        showToast('Failed to save profile.', 'danger');
      }
    }
  };

  const handleCancel = () => dispatch({ type: 'NAVIGATE', view: { name: 'list' } });

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px' }}>
      <H3 style={{ marginBottom: 20 }}>{existingProfile ? 'Edit Profile' : 'New Profile'}</H3>

      <FormGroup
        label="Name"
        labelInfo="(required)"
        intent={submitted && nameError ? 'danger' : 'none'}
        helperText={submitted && nameError ? nameError : undefined}
      >
        <InputGroup
          value={name}
          onChange={e => setName(e.target.value)}
          intent={submitted && nameError ? 'danger' : 'none'}
          placeholder="e.g. Friday Night Chores"
        />
      </FormGroup>

      <FormGroup label="Description">
        <TextArea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          fill
          style={{ resize: 'vertical' }}
          placeholder="Optional description"
        />
      </FormGroup>

      <FormGroup label="Mode">
        <HTMLSelect
          value={mode}
          onChange={e => setMode(e.target.value as GameMode)}
          options={[
            { value: 'roulette', label: 'Roulette — draw with replacement' },
            { value: 'bingo', label: 'Bingo — drawn outcomes are removed' },
          ]}
        />
      </FormGroup>

      <Divider style={{ margin: '20px 0' }} />

      <OutcomesEditor outcomes={outcomes} onChange={setOutcomes} showErrors={submitted} />

      <Divider style={{ margin: '20px 0' }} />

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button intent="primary" icon="floppy-disk" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
