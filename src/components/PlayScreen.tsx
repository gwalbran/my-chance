import {
  Button,
  Callout,
  Card,
  H2,
  H4,
  HTMLSelect,
  NonIdealState,
  ProgressBar,
  Tag,
} from '@blueprintjs/core';
import { useEffect, useRef, useState } from 'react';
import { drawBingo, initBingo, weightedPick } from '../game/draw';
import type { Remaining } from '../game/draw';
import { useObjectUrl } from '../hooks/useObjectUrl';
import { useStore } from '../state/store';
import type { Outcome } from '../types';
import { showToast } from '../util/toaster';

const ANIMATION_DURATION_MS = 1800;
const ANIMATION_INTERVAL_MS = 90;

function OutcomeReveal({ outcome }: { outcome: Outcome }) {
  const imageUrl = useObjectUrl(outcome.image);

  return (
    <Card elevation={3} style={{ textAlign: 'center', padding: 32, maxWidth: 480, margin: '0 auto' }}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={outcome.label}
          style={{ maxWidth: '100%', maxHeight: 240, objectFit: 'contain', borderRadius: 6, marginBottom: 16 }}
        />
      )}
      <H2 style={{ margin: '0 0 8px' }}>{outcome.label}</H2>
      {outcome.description && (
        <Callout style={{ marginTop: 12, textAlign: 'left' }}>{outcome.description}</Callout>
      )}
    </Card>
  );
}

function OutcomeFrame({ outcome, visible }: { outcome: Outcome; visible: boolean }) {
  const imageUrl = useObjectUrl(outcome.image);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      opacity: visible ? 1 : 0,
      transition: 'opacity 70ms ease-in-out',
    }}>
      {imageUrl && (
        <img src={imageUrl} alt={outcome.label} style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain', borderRadius: 6 }} />
      )}
      <H2 style={{ margin: 0, opacity: 0.85, fontStyle: imageUrl ? 'normal' : 'italic' }}>{outcome.label}</H2>
    </div>
  );
}

function AnimatingLabel({ outcomes }: { outcomes: Outcome[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex(i => (i + 1) % outcomes.length);
    }, ANIMATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [outcomes]);

  return (
    <Card elevation={2} style={{ textAlign: 'center', padding: 32, maxWidth: 480, margin: '0 auto' }}>
      <div style={{ position: 'relative', height: 240 }}>
        {outcomes.map((o, i) => (
          <OutcomeFrame key={o.id} outcome={o} visible={i === currentIndex} />
        ))}
      </div>
      <ProgressBar intent="primary" stripes animate style={{ marginTop: 16 }} />
    </Card>
  );
}

export function PlayScreen() {
  const { state, dispatch } = useStore();
  const view = state.view;
  if (view.name !== 'play') return null;

  const [selectedProfileId, setSelectedProfileId] = useState(view.profileId || state.profiles[0]?.id || '');
  const [animating, setAnimating] = useState(false);
  const [drawn, setDrawn] = useState<Outcome | null>(null);
  const [remaining, setRemaining] = useState<Remaining>(new Map());
  const [totalInBucket, setTotalInBucket] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingOutcomeRef = useRef<Outcome | null>(null);

  const profile = state.profiles.find(p => p.id === selectedProfileId);

  const initSession = (profileId: string) => {
    const p = state.profiles.find(pr => pr.id === profileId);
    if (!p) return;
    const r = initBingo(p.outcomes);
    setRemaining(r);
    const total = p.outcomes.reduce((s, o) => s + o.occurrences, 0);
    setTotalInBucket(total);
    setDrawn(null);
    setSessionStarted(true);
  };

  const handleProfileChange = (id: string) => {
    setSelectedProfileId(id);
    setDrawn(null);
    setSessionStarted(false);
    setAnimating(false);
  };

  const remainingCount = profile
    ? Array.from(remaining.values()).reduce((s, v) => s + v, 0)
    : 0;

  const isBingoExhausted = profile?.mode === 'bingo' && sessionStarted && remainingCount === 0;

  const handleDraw = () => {
    if (!profile || animating) return;
    if (profile.outcomes.length === 0) {
      showToast('No outcomes to draw.', 'warning');
      return;
    }

    let outcome: Outcome | null = null;

    if (profile.mode === 'roulette') {
      outcome = weightedPick(profile.outcomes);
    } else {
      if (!sessionStarted) {
        const r = initBingo(profile.outcomes);
        const total = profile.outcomes.reduce((s, o) => s + o.occurrences, 0);
        setRemaining(r);
        setTotalInBucket(total);
        setSessionStarted(true);
        const result = drawBingo(profile.outcomes, r);
        outcome = result.outcome;
        setRemaining(result.remaining);
      } else {
        if (remainingCount === 0) return;
        const result = drawBingo(profile.outcomes, remaining);
        outcome = result.outcome;
        setRemaining(result.remaining);
      }
    }

    if (!outcome) {
      showToast('No outcomes to draw.', 'warning');
      return;
    }

    pendingOutcomeRef.current = outcome;
    setAnimating(true);
    setDrawn(null);

    setTimeout(() => {
      const finalOutcome = pendingOutcomeRef.current;
      setAnimating(false);
      setDrawn(finalOutcome);

      if (finalOutcome?.sound) {
        const url = URL.createObjectURL(finalOutcome.sound.blob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play().catch(() => null).finally(() => {
            URL.revokeObjectURL(url);
          });
        } else {
          URL.revokeObjectURL(url);
        }
      }
    }, ANIMATION_DURATION_MS);
  };

  const handleReshuffle = () => {
    if (!profile) return;
    initSession(profile.id);
    setDrawn(null);
  };

  const profileOptions = state.profiles.map(p => ({ value: p.id, label: p.name }));

  if (state.profiles.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 16px' }}>
        <NonIdealState
          icon="layers"
          title="No profiles yet"
          description="Create a profile first, then come back to play."
          action={
            <Button
              intent="primary"
              icon="add"
              text="Create Profile"
              onClick={() => dispatch({ type: 'NAVIGATE', view: { name: 'editor', profileId: null } })}
            />
          }
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>
      <audio ref={audioRef} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <HTMLSelect
          value={selectedProfileId}
          onChange={e => handleProfileChange(e.target.value)}
          options={profileOptions}
          large
          style={{ flex: 1 }}
        />
        {profile && (
          <Tag large intent={profile.mode === 'roulette' ? 'primary' : 'success'}>
            {profile.mode === 'roulette' ? 'Roulette' : 'Bingo'}
          </Tag>
        )}
      </div>

      {profile?.mode === 'bingo' && sessionStarted && totalInBucket > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: '#8a9ba8' }}>Remaining in bucket</span>
            <span style={{ fontSize: 13 }}>{remainingCount} / {totalInBucket}</span>
          </div>
          <ProgressBar
            value={remainingCount / totalInBucket}
            intent={remainingCount === 0 ? 'danger' : 'success'}
            animate={false}
            stripes={false}
          />
        </div>
      )}

      {isBingoExhausted ? (
        <NonIdealState
          icon="tick-circle"
          title="Bucket empty!"
          description="All outcomes have been drawn."
          action={
            <Button intent="primary" icon="refresh" onClick={handleReshuffle}>
              Reshuffle
            </Button>
          }
        />
      ) : (
        <>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Button
              large
              intent="primary"
              icon={animating ? 'refresh' : 'play'}
              loading={animating}
              disabled={animating}
              onClick={handleDraw}
              style={{ minWidth: 160 }}
            >
              {drawn ? 'Draw Again' : 'Draw'}
            </Button>
          </div>

          {animating && profile && (
            <AnimatingLabel outcomes={profile.outcomes} />
          )}

          {!animating && drawn && (
            <OutcomeReveal outcome={drawn} />
          )}

          {!animating && !drawn && (
            <div style={{ textAlign: 'center', padding: 32 }}>
              {profile ? (
                <H4 style={{ color: '#8a9ba8', fontStyle: 'italic' }}>Press Draw to begin</H4>
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  );
}
