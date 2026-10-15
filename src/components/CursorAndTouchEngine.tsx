import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MousePointer, Hand, Settings2, Check } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

interface TouchRipple {
  id: number;
  x: number;
  y: number;
  color: string;
}

export type CursorColorTheme = 'amber' | 'cyan' | 'emerald' | 'violet';

export const CursorAndTouchEngine: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<TouchRipple[]>([]);
  const [cursorEnabled, setCursorEnabled] = useState(true);
  const [touchEffectEnabled, setTouchEffectEnabled] = useState(true);
  const [colorTheme, setColorTheme] = useState<CursorColorTheme>('amber');
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const particleIdRef = useRef(0);
  const rippleIdRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Color mappings
  const themeColors: Record<CursorColorTheme, { hex: string; rgb: string; name: string }> = {
    amber: { hex: '#f59e0b', rgb: '245, 158, 11', name: 'Prime Amber' },
    cyan: { hex: '#06b6d4', rgb: '6, 182, 212', name: 'Electric Cyan' },
    emerald: { hex: '#10b981', rgb: '16, 185, 129', name: 'Neon Emerald' },
    violet: { hex: '#8b5cf6', rgb: '139, 92, 246', name: 'Vivid Violet' },
  };

  const activeColor = themeColors[colorTheme];

  useEffect(() => {
    // Detect mobile touch capability
    if (typeof window !== 'undefined') {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobileDevice(isTouch);
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Generate particles when moving mouse
      if (cursorEnabled) {
        const dist = Math.hypot(e.clientX - lastPosRef.current.x, e.clientY - lastPosRef.current.y);
        if (dist > 15) {
          lastPosRef.current = { x: e.clientX, y: e.clientY };
          const newParticle: Particle = {
            id: ++particleIdRef.current,
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 4 + 2,
            opacity: 0.8,
          };
          setParticles((prev) => [...prev.slice(-14), newParticle]);
        }
      }

      // Check if hovering clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button') ||
            target.closest('a') ||
            target.closest('input') ||
            target.closest('select') ||
            target.closest('textarea') ||
            target.closest('[role="button"]') ||
            target.closest('.interactive-target')
        );
        setIsHoveringClickable(isClickable);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsMouseDown(true);
      triggerRipple(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setMousePos({ x: touch.clientX, y: touch.clientY });
        triggerRipple(touch.clientX, touch.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setMousePos({ x: touch.clientX, y: touch.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [cursorEnabled]);

  const triggerRipple = (x: number, y: number) => {
    if (!touchEffectEnabled) return;
    const newRipple: TouchRipple = {
      id: ++rippleIdRef.current,
      x,
      y,
      color: activeColor.rgb,
    };
    setRipples((prev) => [...prev.slice(-8), newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 650);
  };

  // Periodic particle cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.12, size: p.size * 0.9 }))
          .filter((p) => p.opacity > 0.05)
      );
    }, 45);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 1. Custom Smooth Mouse Cursor (Desktop) */}
      {cursorEnabled && !isMobileDevice && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {/* Outer ring */}
          <motion.div
            className="fixed top-0 left-0 rounded-full border pointer-events-none"
            style={{
              borderColor: `rgba(${activeColor.rgb}, ${isHoveringClickable ? '0.9' : '0.45'})`,
              backgroundColor: isHoveringClickable
                ? `rgba(${activeColor.rgb}, 0.12)`
                : 'transparent',
              boxShadow: `0 0 15px rgba(${activeColor.rgb}, ${isHoveringClickable ? '0.4' : '0.15'})`,
            }}
            animate={{
              x: mousePos.x - (isHoveringClickable ? 22 : 14),
              y: mousePos.y - (isHoveringClickable ? 22 : 14),
              width: isHoveringClickable ? 44 : 28,
              height: isHoveringClickable ? 44 : 28,
              scale: isMouseDown ? 0.8 : 1,
            }}
            transition={{
              type: 'spring',
              damping: 24,
              stiffness: 280,
              mass: 0.45,
            }}
          />

          {/* Inner precise dot */}
          <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none"
            style={{
              backgroundColor: activeColor.hex,
              boxShadow: `0 0 10px ${activeColor.hex}`,
            }}
            animate={{
              x: mousePos.x - 4,
              y: mousePos.y - 4,
              width: isMouseDown ? 6 : 8,
              height: isMouseDown ? 6 : 8,
            }}
            transition={{
              type: 'spring',
              damping: 35,
              stiffness: 500,
              mass: 0.1,
            }}
          />

          {/* Particle Trail */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="fixed rounded-full pointer-events-none"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                transform: 'translate(-50%, -50%)',
                backgroundColor: activeColor.hex,
                opacity: p.opacity,
                boxShadow: `0 0 6px rgba(${activeColor.rgb}, ${p.opacity})`,
                transition: 'opacity 0.05s linear',
              }}
            />
          ))}
        </div>
      )}

      {/* 2. Interactive Touch & Click Ripples (Finger Animation + Tactile Feedback) */}
      {touchEffectEnabled && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {ripples.map((ripple) => (
            <React.Fragment key={ripple.id}>
              {/* Outer expanding shockwave */}
              <div
                className="fixed rounded-full animate-touch-ripple pointer-events-none"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 50,
                  height: 50,
                  border: `2px solid rgba(${ripple.color}, 0.75)`,
                  boxShadow: `0 0 25px rgba(${ripple.color}, 0.5)`,
                }}
              />
              {/* Finger contact point indicator */}
              <div
                className="fixed rounded-full animate-finger-pulse pointer-events-none"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  transform: 'translate(-50%, -50%)',
                  width: 22,
                  height: 22,
                  backgroundColor: `rgba(${ripple.color}, 0.45)`,
                  border: `1.5px solid rgba(${ripple.color}, 0.9)`,
                }}
              />
            </React.Fragment>
          ))}
        </div>
      )}

      {/* 3. Floating Animation Toggle & Color Controller Widget */}
      <div className="fixed bottom-5 right-5 z-40">
        <div className="relative">
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-12 right-0 w-72 bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-2xl backdrop-blur-md text-xs text-slate-200 mb-2"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 font-medium text-slate-100">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mouse & Finger Animations</span>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-slate-400 hover:text-slate-100 text-sm font-mono"
                  >
                    ✕
                  </button>
                </div>

                {/* Mouse Cursor Toggle */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-3.5 h-3.5 text-slate-400" />
                    <span>Custom Mouse Trail</span>
                  </div>
                  <button
                    onClick={() => setCursorEnabled(!cursorEnabled)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                      cursorEnabled ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        cursorEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Finger Touch Ripple Toggle */}
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <Hand className="w-3.5 h-3.5 text-slate-400" />
                    <span>Finger Touch Ripple</span>
                  </div>
                  <button
                    onClick={() => setTouchEffectEnabled(!touchEffectEnabled)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                      touchEffectEnabled ? 'bg-amber-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        touchEffectEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Color Selector */}
                <div className="mt-3 pt-2 border-t border-slate-800">
                  <p className="text-[11px] text-slate-400 mb-1.5 font-medium">Glow Theme Accent</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(Object.keys(themeColors) as CursorColorTheme[]).map((theme) => {
                      const t = themeColors[theme];
                      const isSelected = colorTheme === theme;
                      return (
                        <button
                          key={theme}
                          onClick={() => setColorTheme(theme)}
                          className={`flex items-center justify-center p-1.5 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-white bg-slate-800'
                              : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full inline-block"
                            style={{ backgroundColor: t.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Test button */}
                <button
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    triggerRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
                  }}
                  className="w-full mt-3 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Hand className="w-3 h-3 text-amber-400" />
                  <span>Test Finger Touch Ripple</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Cursor and Animation Settings"
            className="flex items-center gap-2 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-full shadow-lg text-xs font-medium text-slate-200 backdrop-blur-md transition-all hover:border-amber-500/50"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeColor.hex, boxShadow: `0 0 6px ${activeColor.hex}` }}
            />
            <span className="hidden sm:inline">Cursor & Touch FX</span>
            <Settings2 className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </>
  );
};
