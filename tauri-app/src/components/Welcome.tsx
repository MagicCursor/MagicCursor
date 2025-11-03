import {useEffect, useState} from 'react';
import './Welcome.css';

interface WelcomeProps {
  onComplete: () => void;
}

export default function Welcome({onComplete}: WelcomeProps): JSX.Element | null {
  const [show, setShow] = useState(true);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleClick = (): void => {
    setShow(false);
    setTimeout(onComplete, 800);
  };

  if (!show) return null;

  return (
    <div 
      className={`welcome-container ${stage >= 3 ? 'fade-out' : ''}`}
      onClick={handleClick}
      style={{cursor: stage >= 3 ? 'pointer' : 'default'}}
    >
      {/* Animated background particles */}
      <div className="particles">
        {Array.from({length: 50}).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Neon rings */}
      <div className="neon-rings">
        <div className="ring ring-1" />
        <div className="ring ring-2" />
        <div className="ring ring-3" />
      </div>

      {/* Confetti */}
      <div className="confetti-container">
        {Array.from({length: 30}).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              backgroundColor: [
                '#ff00ff',
                '#00ffff',
                '#ffff00',
                '#ff0080',
                '#00ff80',
              ][Math.floor(Math.random() * 5)],
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="welcome-content">
        <div className={`welcome-icon ${stage >= 1 ? 'show' : ''}`}>
          <div className="icon-glow" />
          <svg viewBox="0 0 100 100" className="sparkle-icon">
            <path
              d="M50 10 L55 40 L85 45 L60 60 L65 90 L50 75 L35 90 L40 60 L15 45 L45 40 Z"
              fill="url(#neon-gradient)"
            />
            <defs>
              <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff00ff" />
                <stop offset="50%" stopColor="#00ffff" />
                <stop offset="100%" stopColor="#ffff00" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className={`welcome-title ${stage >= 1 ? 'show' : ''}`}>
          <span className="title-line">Welcome to</span>
          <span className="title-brand">Magic Cursor</span>
        </h1>

        <p className={`welcome-subtitle ${stage >= 2 ? 'show' : ''}`}>
          Transform your desktop with stunning fluid effects
        </p>

        {stage >= 3 && (
          <p className="welcome-click-hint">
            Click anywhere to continue
          </p>
        )}

        <div className={`welcome-features ${stage >= 2 ? 'show' : ''}`}>
          <div className="feature">
            <div className="feature-icon">✨</div>
            <span>Beautiful Effects</span>
          </div>
          <div className="feature">
            <div className="feature-icon">🎨</div>
            <span>Customizable</span>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <span>High Performance</span>
          </div>
        </div>
      </div>

      {/* Bottom glow */}
      <div className="bottom-glow" />
    </div>
  );
}
