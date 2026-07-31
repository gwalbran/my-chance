import { Callout, Card, H2 } from '@blueprintjs/core';
import { useObjectUrl } from '../hooks/useObjectUrl';
import type { Outcome } from '../types';

export function OutcomeReveal({ outcome }: { outcome: Outcome }) {
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
