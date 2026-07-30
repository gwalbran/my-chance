import type { Outcome } from '../types';

export function weightedPick(outcomes: Outcome[], rng = Math.random): Outcome | null {
  const pool = outcomes.filter(o => o.occurrences > 0);
  if (!pool.length) return null;
  const total = pool.reduce((s, o) => s + o.occurrences, 0);
  let r = rng() * total;
  for (const o of pool) {
    r -= o.occurrences;
    if (r < 0) return o;
  }
  return pool[pool.length - 1];
}

export type Remaining = Map<string, number>;

export function initBingo(outcomes: Outcome[]): Remaining {
  return new Map(
    outcomes.filter(o => o.occurrences > 0).map(o => [o.id, o.occurrences])
  );
}

export function drawBingo(
  outcomes: Outcome[],
  remaining: Remaining,
  rng = Math.random
): { outcome: Outcome | null; remaining: Remaining } {
  const live = outcomes.filter(o => (remaining.get(o.id) ?? 0) > 0);
  if (!live.length) return { outcome: null, remaining };
  const total = live.reduce((s, o) => s + (remaining.get(o.id) ?? 0), 0);
  let r = rng() * total;
  let chosen = live[live.length - 1];
  for (const o of live) {
    r -= remaining.get(o.id) ?? 0;
    if (r < 0) { chosen = o; break; }
  }
  const next = new Map(remaining);
  next.set(chosen.id, (next.get(chosen.id) ?? 0) - 1);
  return { outcome: chosen, remaining: next };
}
