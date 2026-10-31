import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { DiwaliBackground } from './components/DiwaliBackground';
import { BigNumberDisplay } from './components/BigNumberDisplay';
import { RecentNumbers } from './components/RecentNumbers';
import { NumberBoard } from './components/NumberBoard';
import { AutoPlayControls } from './components/AutoPlayControls';
import { SettingsModal } from './components/SettingsModal';
import { ClaimVerifierModal } from './components/ClaimVerifierModal';
import { soundEffects } from './utils/audioSynthesizer';
import { speechAnchor } from './utils/speechAnchor';
import { triggerDiwaliBurst, triggerGrandCelebration } from './utils/diwaliCrackerBurst';

const STORAGE_KEY = 'diwali_tambola_game_v1';

export function App() {
  // Game state
  const [history, setHistory] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.history)) return parsed.history;
      }
    } catch {
      // fallback
    }
    return [];
  });

  const calledNumbers = new Set(history);
  const currentNumber = history.length > 0 ? history[history.length - 1] : null;
  const previousNumber = history.length > 1 ? history[history.length - 2] : null;

  // Suspense & Speech synchronization state
  const [isRolling, setIsRolling] = useState(false);
  const [rollingNumber, setRollingNumber] = useState<number | null>(null);
  const [isSpeakingSuspense, setIsSpeakingSuspense] = useState(false);
  const [pendingNumber, setPendingNumber] = useState<number | null>(null);
  const pendingNumberRef = useRef<number | null>(null);
  pendingNumberRef.current = pendingNumber;

  // Auto-play state
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoIntervalSeconds, setAutoIntervalSeconds] = useState(8);
  const [secondsRemaining, setSecondsRemaining] = useState(8);

  // Sound toggles
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [soundFxEnabled, setSoundFxEnabled] = useState(true);
  const isMuted = !voiceEnabled && !soundFxEnabled;

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isClaimVerifierOpen, setIsClaimVerifierOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ history }));
    } catch {
      // ignore
    }
  }, [history]);

  // Sync audio managers with state
  useEffect(() => {
    speechAnchor.voiceEnabled = voiceEnabled;
    soundEffects.soundEnabled = soundFxEnabled;
  }, [voiceEnabled, soundFxEnabled]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVoiceEnabled(true);
      setSoundFxEnabled(true);
      soundEffects.soundEnabled = true;
      speechAnchor.voiceEnabled = true;
    } else {
      setVoiceEnabled(false);
      setSoundFxEnabled(false);
      soundEffects.soundEnabled = false;
      speechAnchor.voiceEnabled = false;
      speechAnchor.stop();
    }
  };

  /**
   * Finalizes and reveals the number on screen with full fireworks & sound effects!
   */
  const revealNumber = useCallback((numToReveal: number) => {
    setIsSpeakingSuspense(false);
    setPendingNumber(null);
    pendingNumberRef.current = null;

    setHistory((prev) => {
      // Guard against duplicate commits
      if (prev.includes(numToReveal)) return prev;
      const nextHistory = [...prev, numToReveal];

      // Festive audio & visuals upon reveal
      soundEffects.playDiwaliCracker();
      soundEffects.playNumberPop();
      triggerDiwaliBurst(numToReveal === 90 || numToReveal === 7 || nextHistory.length % 15 === 0);

      // If last number of the 90, celebrate full house!
      if (nextHistory.length === 90) {
        setIsAutoPlay(false);
        triggerGrandCelebration();
        setTimeout(() => {
          soundEffects.playSuccessFanfare();
          speechAnchor.speakCustom(
            'All 90 numbers completed! Game over! Happy Diwali to everyone in the office!'
          );
        }, 1200);
      }

      return nextHistory;
    });

    // Reset countdown for auto-play so players get full time AFTER seeing the number
    setSecondsRemaining(autoIntervalSeconds);
  }, [autoIntervalSeconds]);

  /**
   * Skip suspense: If the host wants to reveal immediately without waiting for speech
   */
  const skipSuspenseAndReveal = useCallback(() => {
    if (pendingNumberRef.current !== null) {
      revealNumber(pendingNumberRef.current);
    }
  }, [revealNumber]);

  /**
   * Draw Next Number:
   * 1. Picks an uncalled number.
   * 2. Starts suspense: Anchor speaks the lines/riddle FIRST.
   * 3. Number remains HIDDEN as a mystery '?' on screen.
   * 4. Once speech finishes, revealNumber is called!
   */
  const pickNextNumber = useCallback(() => {
    if (history.length >= 90 || isRolling || isSpeakingSuspense) return;

    // Remaining uncalled pool
    const uncalled: number[] = [];
    for (let i = 1; i <= 90; i++) {
      if (!calledNumbers.has(i)) {
        uncalled.push(i);
      }
    }

    if (uncalled.length === 0) return;

    const randomIndex = Math.floor(Math.random() * uncalled.length);
    const chosen = uncalled[randomIndex];

    setIsRolling(true);
    soundEffects.playTension();

    // Quick 250ms shuffle animation
    let elapsed = 0;
    const intervalTime = 50;
    const shuffleTimer = setInterval(() => {
      elapsed += intervalTime;
      const fake = uncalled[Math.floor(Math.random() * uncalled.length)];
      setRollingNumber(fake);

      if (elapsed >= 250) {
        clearInterval(shuffleTimer);
        setIsRolling(false);
        setRollingNumber(null);

        // Enter Suspense Mode: Anchor speaks lines first, number stays hidden!
        setPendingNumber(chosen);
        pendingNumberRef.current = chosen;
        setIsSpeakingSuspense(true);

        // Anchor speaks: speaks lines first, number in the last.
        // Once speech finishes -> callback reveals the number on screen!
        speechAnchor.speak(chosen, () => {
          revealNumber(chosen);
        });
      }
    }, intervalTime);
  }, [history, calledNumbers, isRolling, isSpeakingSuspense, revealNumber]);

  // Repeat current number audio (when already revealed)
  const repeatCurrentAudio = useCallback(() => {
    if (currentNumber !== null && !isSpeakingSuspense) {
      soundEffects.playClick();
      speechAnchor.speak(currentNumber);
    }
  }, [currentNumber, isSpeakingSuspense]);

  // Reset Game
  const resetGame = () => {
    setIsAutoPlay(false);
    setIsSpeakingSuspense(false);
    setPendingNumber(null);
    pendingNumberRef.current = null;
    setHistory([]);
    speechAnchor.stop();
    localStorage.removeItem(STORAGE_KEY);
    soundEffects.playClick();
  };

  // Auto-play timer loop
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Only count down when AutoPlay is ON, not rolling, not in suspense speech, and game not over
    if (!isAutoPlay || history.length >= 90 || isSpeakingSuspense || isRolling) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          pickNextNumber();
          return autoIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [
    isAutoPlay,
    autoIntervalSeconds,
    history.length,
    isSpeakingSuspense,
    isRolling,
    pickNextNumber,
  ]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        return;
      }

      // Spacebar or Enter
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        // If currently in suspense, pressing space immediately reveals the number!
        if (isSpeakingSuspense) {
          skipSuspenseAndReveal();
        } else {
          pickNextNumber();
        }
      }
      // 'R' -> Repeat voice
      else if (e.code === 'KeyR') {
        e.preventDefault();
        repeatCurrentAudio();
      }
      // 'A' -> Toggle Auto-Play
      else if (e.code === 'KeyA') {
        e.preventDefault();
        setIsAutoPlay((prev) => !prev);
      }
      // 'M' -> Toggle Mute
      else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      }
      // 'F' -> Toggle Fullscreen
      else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
      // 'Escape' -> Close modal or stop autoplay
      else if (e.code === 'Escape') {
        if (isSettingsOpen) setIsSettingsOpen(false);
        if (isClaimVerifierOpen) setIsClaimVerifierOpen(false);
        if (isAutoPlay) setIsAutoPlay(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    pickNextNumber,
    skipSuspenseAndReveal,
    repeatCurrentAudio,
    isSettingsOpen,
    isClaimVerifierOpen,
    isAutoPlay,
    isMuted,
    isSpeakingSuspense,
  ]);

  return (
    <div className="relative min-h-screen bg-diwali-dark text-white flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Animated Diwali Glow & Sparkles Background */}
      <DiwaliBackground />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col flex-1 pb-12">
        {/* Top Header Bar */}
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenClaimVerifier={() => setIsClaimVerifierOpen(true)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />

        {/* Auto-Play Toolbar */}
        <div className="w-full flex justify-center px-4 mt-1 mb-2">
          <AutoPlayControls
            isAutoPlay={isAutoPlay}
            onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
            autoIntervalSeconds={autoIntervalSeconds}
            onChangeInterval={(sec) => setAutoIntervalSeconds(sec)}
            secondsRemaining={secondsRemaining}
            disabled={history.length >= 90 || isRolling}
          />
        </div>

        {/* Center: Big Number Display with Suspense & Speech Synchronization */}
        <main className="flex-1 flex flex-col items-center justify-center">
          <BigNumberDisplay
            currentNumber={currentNumber}
            previousNumber={previousNumber}
            isRolling={isRolling}
            rollingNumber={rollingNumber}
            pendingNumber={pendingNumber}
            isSpeakingSuspense={isSpeakingSuspense}
            totalCalled={history.length}
            onPickNext={pickNextNumber}
            onSkipSuspense={skipSuspenseAndReveal}
            onRepeatAudio={repeatCurrentAudio}
            disabled={isRolling}
          />

          {/* Recent Numbers Strip */}
          <RecentNumbers
            history={history}
            onNumberClick={(num) => {
              soundEffects.playClick();
              speechAnchor.speak(num);
            }}
          />
        </main>

        {/* Master 1-90 Number Board */}
        <section className="mt-4">
          <NumberBoard
            calledNumbers={calledNumbers}
            currentNumber={currentNumber}
            history={history}
            onSelectNumber={(num) => {
              soundEffects.playClick();
              speechAnchor.speak(num);
            }}
          />
        </section>

        {/* Footer */}
        <footer className="w-full text-center py-4 text-xs text-amber-200/50 flex flex-col items-center gap-1">
          <div>
            🪔 Happy Diwali! Created with love for Office Housie Celebrations 🪔
          </div>
          <div className="text-[11px] text-amber-300/40">
            Press <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-amber-500/20 font-mono text-amber-200">SPACE</kbd> for next number • Number reveals when speech finishes!
          </div>
        </footer>
      </div>

      {/* Claim Verifier Modal */}
      <ClaimVerifierModal
        isOpen={isClaimVerifierOpen}
        onClose={() => setIsClaimVerifierOpen(false)}
        calledNumbers={calledNumbers}
        history={history}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        soundFxEnabled={soundFxEnabled}
        onToggleSoundFx={() => setSoundFxEnabled(!soundFxEnabled)}
        onResetGame={resetGame}
      />
    </div>
  );
}

export default App;
