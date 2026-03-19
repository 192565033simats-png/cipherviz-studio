import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    document.body.classList.add('custom-cursor');

    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${e.clientX}px`;
        ringRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"], input, textarea, select, label')) {
        setHovering(true);
      }
    };
    const onOut = () => setHovering(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      document.body.classList.remove('custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          width: clicking ? 6 : 8,
          height: clicking ? 6 : 8,
          borderRadius: '50%',
          background: `linear-gradient(135deg, hsl(var(--gold)), hsl(var(--gold-light)))`,
        }}
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: hovering ? 48 : clicking ? 24 : 32,
          height: hovering ? 48 : clicking ? 24 : 32,
          borderRadius: '50%',
          border: `1.5px solid hsl(var(--gold) / ${hovering ? 0.6 : 0.3})`,
          transition: 'width 0.2s ease, height 0.2s ease, left 0.15s ease, top 0.15s ease, border 0.2s ease',
          background: hovering ? 'hsl(var(--gold) / 0.05)' : 'transparent',
        }}
      />
    </>
  );
}
