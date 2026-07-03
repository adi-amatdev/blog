'use client';

import { useState, useEffect } from 'react';

const FULL_TEXT = "Aadis Intelligence";
const SHORT_TEXT = "AI";

interface Props {
  variant?: 'hero' | 'header';
}

export function TypewriterHeading({ variant = 'hero' }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing' | 'collapsed'>('typing');
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (phase !== 'typing') return;
    if (displayed.length < FULL_TEXT.length) {
      const timer = setTimeout(() => {
        setDisplayed(FULL_TEXT.slice(0, displayed.length + 1));
      }, 80);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setPhase('collapsed'), 2000);
    return () => clearTimeout(timer);
  }, [displayed, phase]);

  const text = hovered ? FULL_TEXT : phase === 'typing' ? displayed : SHORT_TEXT;

  if (variant === 'header') {
    return (
      <span
        className="inline-flex items-center text-lg font-bold tracking-tight hover:text-accent transition-colors"
        style={{ minWidth: 160, justifyContent: 'flex-start' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {text}
        {phase === 'typing' && displayed.length < FULL_TEXT.length && (
          <span className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 animate-pulse" />
        )}
      </span>
    );
  }

  return (
    <h1
      className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {text}
      {phase === 'typing' && displayed.length < FULL_TEXT.length && (
        <span className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 animate-pulse align-middle" />
      )}
    </h1>
  );
}
