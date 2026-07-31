import { Alert, Button, Card, Intent, Menu, MenuItem, NonIdealState, Popover, Tag } from '@blueprintjs/core';
import { useState } from 'react';
import { deleteProfile } from '../persistence/profileRepo';
import { useStore } from '../state/store';
import type { Profile } from '../types';
import { showToast } from '../util/toaster';

function ProfileActions({ profile, onDelete }: { profile: Profile; onDelete: () => void }) {
  const { dispatch } = useStore();

  const menu = (
    <Menu>
      <MenuItem
        icon="play"
        text="Play"
        intent="success"
        onClick={() => dispatch({ type: 'NAVIGATE', view: { name: 'play', profileId: profile.id } })}
      />
      <MenuItem
        icon="edit"
        text="Edit"
        onClick={() => dispatch({ type: 'NAVIGATE', view: { name: 'editor', profileId: profile.id } })}
      />
      <MenuItem
        icon="trash"
        text="Delete"
        intent="danger"
        onClick={onDelete}
      />
    </Menu>
  );

  return (
    <Popover content={menu} placement="bottom-end">
      <Button minimal icon="more" aria-label="Profile actions" />
    </Popover>
  );
}

export function ProfileList() {
  const { state, dispatch } = useStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteProfile(deletingId);
    dispatch({ type: 'PROFILE_DELETED', id: deletingId });
    setDeletingId(null);
    showToast('Profile deleted', 'none');
  };

  const deletingProfile = state.profiles.find(p => p.id === deletingId);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Profiles</h2>
        <Button
          intent="primary"
          icon="add"
          text="New Profile"
          onClick={() => dispatch({ type: 'NAVIGATE', view: { name: 'editor', profileId: null } })}
        />
      </div>

      {state.profiles.length === 0 ? (
        <NonIdealState
          icon="layers"
          title="No profiles yet"
          description="Create a profile to start building your game."
          action={
            <Button
              intent="primary"
              icon="add"
              text="Create Profile"
              onClick={() => dispatch({ type: 'NAVIGATE', view: { name: 'editor', profileId: null } })}
            />
          }
        />
      ) : (
        state.profiles.map((profile: Profile) => (
          <Card key={profile.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: profile.description ? 4 : 0 }}>
                  <button
                    onClick={() => dispatch({ type: 'NAVIGATE', view: { name: 'play', profileId: profile.id } })}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit', fontWeight: 'bold', textAlign: 'left' }}
                  >
                    {profile.name}
                  </button>
                  <Tag minimal intent={profile.mode === 'roulette' ? 'primary' : 'success'}>
                    {profile.mode === 'roulette' ? 'Roulette' : 'Bingo'}
                  </Tag>
                  <Tag minimal>{profile.outcomes.length} outcome{profile.outcomes.length !== 1 ? 's' : ''}</Tag>
                </div>
                {profile.description && (
                  <p style={{ margin: 0, color: '#888', fontSize: 13 }}>{profile.description}</p>
                )}
              </div>
              <ProfileActions profile={profile} onDelete={() => setDeletingId(profile.id)} />
            </div>
          </Card>
        ))
      )}

      <Alert
        isOpen={deletingId !== null}
        intent={Intent.DANGER}
        icon="trash"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      >
        <p>
          Delete profile <strong>{deletingProfile?.name}</strong>? This cannot be undone.
        </p>
      </Alert>
    </div>
  );
}
