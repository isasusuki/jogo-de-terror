import React, { useEffect, useRef } from 'react';

interface AtmosphereCanvasProps {
  isSpectralActive: boolean;
  onLightningTrigger?: () => void;
}

export const AtmosphereCanvas: React.FC<AtmosphereCanvasProps> = ({
  isSpectralActive,
  onLightningTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating dust motes / spirit orbs
    const particleCount = isSpectralActive ? 50 : 30;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (isSpectralActive ? 3.5 : 2.0) + 0.8,
      speedX: (Math.random() - 0.5) * (isSpectralActive ? 0.8 : 0.3),
      speedY: -(Math.random() * 0.4 + 0.1),
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      hue: isSpectralActive ? 275 : 38, // Amethyst purple in spectral, warm amber/dust in normal
    }));

    // Random lightning flash system
    let nextLightning = Date.now() + Math.random() * 14000 + 8000;
    let flashAlpha = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Check lightning
      const now = Date.now();
      if (now > nextLightning) {
        flashAlpha = Math.random() * 0.35 + 0.25;
        nextLightning = now + Math.random() * 20000 + 10000;
        if (onLightningTrigger) {
          onLightningTrigger();
        }
      }

      // Draw lightning flash
      if (flashAlpha > 0.005) {
        ctx.fillStyle = `rgba(235, 245, 255, ${flashAlpha})`;
        ctx.fillRect(0, 0, width, height);
        flashAlpha *= 0.88; // Quick decay
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(now * p.pulseSpeed) * 0.008;
        if (p.alpha < 0.1) p.alpha = 0.1;
        if (p.alpha > 0.7) p.alpha = 0.7;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isSpectralActive
          ? `hsla(280, 85%, 70%, ${p.alpha * 0.8})`
          : `hsla(40, 60%, 75%, ${p.alpha * 0.45})`;
        ctx.fill();

        if (isSpectralActive) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(280, 85%, 70%, ${p.alpha * 0.2})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSpectralActive, onLightningTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-700"
    />
  );
};
