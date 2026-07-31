import { Icon } from '@blueprintjs/core';
import { useState } from 'react';

interface Props {
  content: string;
}

export function HelpTip({ content }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      style={{ position: 'relative', display: 'inline-block', marginLeft: 4, verticalAlign: 'text-bottom' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={e => { e.preventDefault(); setVisible(v => !v); }}
    >
      <Icon icon="help" size={13} style={{ cursor: 'help', color: '#5c7080' }} />
      {visible && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#394b59',
          color: '#f5f8fa',
          padding: '6px 10px',
          borderRadius: 3,
          fontSize: 12,
          lineHeight: 1.5,
          maxWidth: 260,
          width: 'max-content',
          whiteSpace: 'normal',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}>
          {content}
        </span>
      )}
    </span>
  );
}
