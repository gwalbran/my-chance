import type { Profile } from '../types';
import { openDb, STORE } from './db';

function tx<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    db =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = fn(t.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

export function getAll(): Promise<Profile[]> {
  return tx('readonly', store => store.getAll());
}

export function put(profile: Profile): Promise<IDBValidKey> {
  return tx('readwrite', store => store.put(profile));
}

export function deleteProfile(id: string): Promise<undefined> {
  return tx('readwrite', store => store.delete(id));
}
