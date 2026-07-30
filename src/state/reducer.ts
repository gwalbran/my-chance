import type { Profile, View } from '../types';
import type { Action } from './actions';

export interface AppState {
  profiles: Profile[];
  view: View;
}

export const initialState: AppState = {
  profiles: [],
  view: { name: 'list' },
};

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'PROFILES_LOADED':
      return { ...state, profiles: action.profiles };
    case 'PROFILE_SAVED': {
      const exists = state.profiles.some(p => p.id === action.profile.id);
      return {
        ...state,
        profiles: exists
          ? state.profiles.map(p => (p.id === action.profile.id ? action.profile : p))
          : [...state.profiles, action.profile],
      };
    }
    case 'PROFILE_DELETED':
      return { ...state, profiles: state.profiles.filter(p => p.id !== action.id) };
    case 'NAVIGATE':
      return { ...state, view: action.view };
  }
}
