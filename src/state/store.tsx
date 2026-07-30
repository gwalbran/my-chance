import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { getAll } from '../persistence/profileRepo';
import type { Action } from './actions';
import { initialState, reducer } from './reducer';
import type { AppState } from './reducer';

interface StoreContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getAll().then(profiles => dispatch({ type: 'PROFILES_LOADED', profiles }));
  }, []);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
