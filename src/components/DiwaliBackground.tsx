import React, { useEffect, useRef } from 'react';

export const DiwaliBackground: React.FC = () => {
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

    // Floating golden sparkle particles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      color: string;
    }

    const colors = ['#ffd166', '#ffb703', '#ff5400', '#f72585', '#ffe6a7'];
    const particles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 1,
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.7 + 0.2,
      fadeSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle radial ambient light in center
      const grad = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        50,
        width / 2,
        height * 0.45,
        Math.max(width, height) * 0.75
      );
      grad.addColorStop(0, 'rgba(67, 16, 92, 0.4)');
      grad.addColorStop(0.5, 'rgba(29, 8, 48, 0.7)');
      grad.addColorStop(1, 'rgba(12, 4, 22, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render floating golden sparkles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;

        if (p.opacity <= 0.1) {
          p.opacity = 0.1;
          p.fadeSpeed = Math.abs(p.fadeSpeed);
        } else if (p.opacity >= 0.85) {
          p.opacity = 0.85;
          p.fadeSpeed = -Math.abs(p.fadeSpeed);
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background canvas for sparkles & ambient glow */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Top Traditional Marigold & Mango Leaves Garland (Toran) */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 shadow-lg shadow-orange-500/30 flex justify-around items-center px-4">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-3.5 rounded-b-full bg-gradient-to-b from-yellow-300 via-orange-400 to-amber-600 shadow-sm opacity-90 animate-pulse"
            style={{ animationDelay: `${(i % 5) * 0.3}s` }}
          />
        ))}
      </div>

      {/* Left Hanging Festive Lantern (Kandil) */}
      <div className="absolute top-2 left-6 hidden lg:flex flex-col items-center opacity-85 hover:opacity-100 transition duration-300 animate-float">
        <div className="w-0.5 h-16 bg-gradient-to-b from-amber-400 to-orange-500"></div>
        <div className="w-12 h-14 bg-gradient-to-b from-amber-400 via-orange-600 to-red-600 rounded-lg shadow-lg shadow-amber-500/40 border border-amber-300 flex items-center justify-center">
          <span className="text-xl">🪔</span>
        </div>
        <div className="flex gap-1.5 mt-0.5">
          <div className="w-1 h-8 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-12 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-1 h-8 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Right Hanging Festive Lantern (Kandil) */}
      <div className="absolute top-2 right-6 hidden lg:flex flex-col items-center opacity-85 hover:opacity-100 transition duration-300 animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="w-0.5 h-16 bg-gradient-to-b from-amber-400 to-orange-500"></div>
        <div className="w-12 h-14 bg-gradient-to-b from-amber-400 via-orange-600 to-red-600 rounded-lg shadow-lg shadow-amber-500/40 border border-amber-300 flex items-center justify-center">
          <span className="text-xl">🪔</span>
        </div>
        <div className="flex gap-1.5 mt-0.5">
          <div className="w-1 h-8 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-12 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          <div className="w-1 h-8 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        </div>
      </div>

      {/* Bottom Corner Diyas */}
      <div className="absolute bottom-3 left-6 flex items-center gap-2 drop-shadow-[0_0_15px_rgba(255,183,3,0.8)]">
        <span className="text-3xl animate-diya-flicker">🪔</span>
        <div className="hidden sm:block text-xs font-semibold text-amber-300 tracking-wider uppercase opacity-80">
          Shubh Diwali
        </div>
      </div>

      <div className="absolute bottom-3 right-6 flex items-center gap-2 drop-shadow-[0_0_15px_rgba(255,183,3,0.8)]">
        <div className="hidden sm:block text-xs font-semibold text-amber-300 tracking-wider uppercase opacity-80">
          Office Housie
        </div>
        <span className="text-3xl animate-diya-flicker" style={{ animationDelay: '0.7s' }}>🪔</span>
      </div>
    </div>
  );
};

