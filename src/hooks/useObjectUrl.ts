import { useEffect, useState } from 'react';
import type { MediaAsset } from '../types';

export function useObjectUrl(asset: MediaAsset | undefined): string | undefined {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!asset) {
      setUrl(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(asset.blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [asset]);

  return url;
}
