import { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import './ClickThroughIndicator.css';

export default function ClickThroughIndicator(): JSX.Element {
  const [isClickThrough, setIsClickThrough] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const unlisten = listen<boolean>('click-through-changed', (event) => {
      setIsClickThrough(event.payload);
      setShowNotification(true);

      // Hide notification after 2 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    });

    return () => {
      unlisten.then((fn) => fn());
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
