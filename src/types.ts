export type GameMode = 'roulette' | 'bingo';

export type View =
  | { name: 'list' }
  | { name: 'editor'; profileId: string | null }
  | { name: 'play'; profileId: string };

export interface MediaAsset {
  blob: Blob;
  mimeType: string;
  name: string;
}

export interface Outcome {
  id: string;
  label: string;
  description?: string;
  occurrences: number;
  image?: MediaAsset;
  sound?: MediaAsset;
}

export interface Profile {
  id: string;
  name: string;
  description?: string;
  mode: GameMode;
  outcomes: Outcome[];
  createdAt: number;
  updatedAt: number;
}
