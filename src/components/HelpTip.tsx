import { Icon } from '@blueprintjs/core';
import { useEffect, useRef, useState } from 'react';

interface Props {
  content: string;
}

export function HelpTip({ content }: Props) {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  // The tooltip is centered above the icon using left:50% + translateX(-50%). On narrow
  // screens this can push the tooltip partially off either edge of the viewport. nudge is
  // a pixel correction added to the translateX to shift it back within the viewport.
  const [nudge, setNudge] = useState(0);

  useEffect(() => {
    if (!visible) {
      // Reset nudge when hiding so the next show always starts from the un-nudged
      // (centered) position before measuring. Without this reset the effect would
      // measure the already-corrected position on re-hover, see no overflow, and
      // clear the nudge — putting the tooltip back into the overflowing position.
      setNudge(0);
      return;
    }
    if (!tooltipRef.current) return;
    const rect = tooltipRef.current.getBoundingClientRect();
    const margin = 8;
    if (rect.left < margin) {
      setNudge(margin - rect.left);
    } else if (rect.right > window.innerWidth - margin) {
      setNudge(window.innerWidth - margin - rect.right);
    }
  }, [visible]);

  return (
    <span
      style={{ position: 'relative', display: 'inline-block', marginLeft: 4, verticalAlign: 'text-bottom' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={e => { e.preventDefault(); setVisible(v => !v); }}
    >
      <Icon icon="help" size={13} style={{ cursor: 'help', color: '#5c7080' }} />
      {visible && (
        <span
          ref={tooltipRef}
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: `translateX(calc(-50% + ${nudge}px))`,
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
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
