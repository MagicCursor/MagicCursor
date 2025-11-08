import { useEffect, useState, useRef } from 'react';
import { listen } from '@tauri-apps/api/event';
import './ClickThroughIndicator.css';

export default function ClickThroughIndicator(): JSX.Element {
  const [isClickThrough, setIsClickThrough] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let unlistenFn: (() => void) | null = null;
    let isMounted = true;

    const setupListener = async () => {
      try {
        unlistenFn = await listen<boolean>('click-through-changed', (event) => {
          if (!isMounted) return;

          setIsClickThrough(event.payload);
          setShowNotification(true);

          // Clear existing timeout
          if (timeoutRef.current) clearTimeout(timeoutRef.current);

          // Hide notification after 2 seconds
          timeoutRef.current = setTimeout(() => {
            if (isMounted) {
              setShowNotification(false);
            }
            timeoutRef.current = null;
          }, 2000);
        });
      } catch (e) {
        console.error('Failed to setup listener:', e);
      }
    };

    setupListener();

    return () => {
      isMounted = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (unlistenFn) unlistenFn();
    };
  }, []);

  if (!showNotification) return <></>;

  return (
    <div className="click-through-notification">
      <div className="notification-content">
        <div className="notification-icon">{isClickThrough ? '👆' : '🖱️'}</div>
        <div className="notification-text">
          <div className="notification-title">
            {isClickThrough ? 'Click-Through Enabled' : 'Click-Through Disabled'}
          </div>
          <div className="notification-subtitle">
            {isClickThrough
              ? 'Clicks pass through to apps below'
              : 'Fluid effect responds to mouse'}
          </div>
        </div>
      </div>
    </div>
  );
}
