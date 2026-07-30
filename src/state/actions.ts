import type { Profile, View } from '../types';

export type Action =
  | { type: 'PROFILES_LOADED'; profiles: Profile[] }
  | { type: 'PROFILE_SAVED'; profile: Profile }
  | { type: 'PROFILE_DELETED'; id: string }
  | { type: 'NAVIGATE'; view: View };
