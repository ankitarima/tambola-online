import confetti from 'canvas-confetti';

export const triggerDiwaliBurst = (isMilestone: boolean = false) => {
  if (typeof window === 'undefined') return;

  const count = isMilestone ? 120 : 45;
  const defaults = {
    origin: { y: 0.65 },
    colors: ['#ffd166', '#ffb703', '#ff5400', '#e63946', '#f72585', '#ffffff'],
    disableForReducedMotion: true,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 30,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const triggerGrandCelebration = () => {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ffd166', '#ff5400', '#f72585', '#06d6a0'],
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ffd166', '#ff5400', '#f72585', '#06d6a0'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

