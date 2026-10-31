import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import { TAMBOLA_DATA } from '../data/tambolaPhrases';

interface BigNumberDisplayProps {
  currentNumber: number | null;
  previousNumber: number | null;
  isRolling: boolean;
  rollingNumber: number | null;
  pendingNumber: number | null;
  isSpeakingSuspense: boolean;
  totalCalled: number;
  onPickNext: () => void;
  onSkipSuspense?: () => void;
  onRepeatAudio: () => void;
  disabled?: boolean;
}

export const BigNumberDisplay: React.FC<BigNumberDisplayProps> = ({
  currentNumber,
  previousNumber,
  isRolling,
  rollingNumber,
  pendingNumber,
  isSpeakingSuspense,
  totalCalled,
  onPickNext,
  onSkipSuspense,
  onRepeatAudio,
  disabled = false,
}) => {
  const [pulseKey, setPulseKey] = useState(0);

  // Trigger pop animation whenever currentNumber changes
  useEffect(() => {
    if (currentNumber !== null) {
      setPulseKey((k) => k + 1);
    }
  }, [currentNumber]);

  const displayNum = isRolling ? rollingNumber : currentNumber;
  const numData = displayNum ? TAMBOLA_DATA[displayNum] : null;
  const pendingData = pendingNumber ? TAMBOLA_DATA[pendingNumber] : null;
  const isGameOver = totalCalled >= 90;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 py-3 sm:py-6">
      {/* Golden Aura Glow Background */}
      <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/30 to-red-600/20 rounded-3xl blur-3xl -z-10 pointer-events-none" />

      {/* Main Showcase Container */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#240b36]/90 via-[#19062b]/95 to-[#0f041d] border-2 border-amber-400/50 shadow-[0_0_50px_rgba(255,183,3,0.35)] p-4 sm:p-8 flex flex-col items-center justify-between min-h-[400px] sm:min-h-[480px] backdrop-blur-xl">
        
        {/* Top Badges Bar */}
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-medium border-b border-amber-500/20 pb-3 mb-2">
          {/* Previous Number */}
          <div className="flex items-center gap-2">
            <span className="text-amber-300/70 uppercase tracking-wider text-[11px] sm:text-xs">
              Previous:
            </span>
            {previousNumber ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                #{previousNumber} {TAMBOLA_DATA[previousNumber]?.hindi ? `(${TAMBOLA_DATA[previousNumber].hindi})` : ''}
              </span>
            ) : (
              <span className="text-gray-500 italic">None</span>
            )}
          </div>

          {/* Counter Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-600/30 text-amber-200 border border-amber-500/40 font-semibold shadow-inner">
              🎯 Called: <span className="text-white font-extrabold">{totalCalled}</span> / 90
            </span>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-purple-900/40 text-purple-200 border border-purple-500/30 text-xs">
              Left: {90 - totalCalled}
            </span>
          </div>
        </div>

        {/* Center: The Massive Number or Suspense Mystery Question */}
        <div className="relative my-auto flex flex-col items-center justify-center py-2 sm:py-4 w-full">
          {/* Circular Decorative Rings */}
          <div className="absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full border border-dashed border-amber-400/30 -z-0 animate-[spin_40s_linear_infinite] pointer-events-none" />
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-amber-500/20 -z-0 pointer-events-none" />

          {/* 1. SUSPENSE STATE: Anchor is speaking the riddle, number is hidden! */}
          {isSpeakingSuspense && pendingData ? (
            <div className="relative z-10 flex flex-col items-center select-none animate-fadeIn w-full">
              {/* Giant Mystery Question Mark with pulsing golden glow */}
              <div className="relative flex items-center justify-center my-1">
                <div className="text-8xl sm:text-9xl md:text-[11rem] lg:text-[13rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-orange-500 animate-pulse drop-shadow-[0_0_40px_rgba(255,183,3,0.9)] font-mono">
                  ?
                </div>
                <div className="absolute w-36 h-36 sm:w-52 sm:h-52 rounded-full border-2 border-dashed border-amber-400/50 animate-[spin_6s_linear_infinite] pointer-events-none" />
              </div>

              {/* Suspense Mystery Box with Riddle Line */}
              <div className="mt-2 flex flex-col items-center gap-2 text-center max-w-xl w-full px-2">
                <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-red-600 via-amber-600 to-red-600 border border-amber-300 shadow-[0_0_20px_rgba(255,183,3,0.5)] text-yellow-100 font-extrabold text-xs sm:text-base tracking-wide uppercase flex items-center gap-2 animate-bounce">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>🎙️ Anchor Riddle • Guess The Number!</span>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </div>

                {/* The Riddle / Line being spoken */}
                <div className="w-full p-4 rounded-2xl bg-black/60 border-2 border-amber-400/60 shadow-[0_0_25px_rgba(255,183,3,0.3)] text-amber-200">
                  <div className="text-[11px] sm:text-xs uppercase tracking-widest text-amber-400 font-extrabold mb-1">
                    Anchor Calling Out:
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-yellow-200 italic tracking-wide">
                    "{pendingData.tagline || pendingData.nickname}"
                  </div>
                </div>

                <div className="text-xs text-amber-300/80 flex items-center justify-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-semibold">
                    Speaking live... Number reveals right when speech finishes!
                  </span>
                </div>
              </div>
            </div>
          ) : displayNum !== null ? (
            /* 2. REVEALED STATE: The Colossal Number is Shown */
            <div
              key={pulseKey}
              className={`relative z-10 flex flex-col items-center select-none ${
                isRolling ? 'scale-95 blur-[0.5px]' : 'animate-pop-in'
              }`}
            >
              {/* The Colossal Number */}
              <div className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[14rem] leading-none font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-orange-500 drop-shadow-[0_10px_25px_rgba(255,183,3,0.7)] font-mono">
                {displayNum}
              </div>

              {/* Hindi & Nickname Banner */}
              {numData && !isRolling && (
                <div className="mt-2 flex flex-col items-center gap-1.5 text-center max-w-xl">
                  {/* Traditional Tambola Nickname */}
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/80 via-amber-600/80 to-red-600/80 border border-amber-300/60 shadow-lg shadow-orange-500/20 text-yellow-100 font-bold text-sm sm:text-lg tracking-wide uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                    <span>{numData.nickname || `Number ${displayNum}`}</span>
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                  </div>

                  {/* Hindi Name & Phrasing */}
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-amber-200/90 font-medium mt-1">
                    <span className="font-semibold text-amber-300 text-base">
                      {numData.hindiName} ({numData.hindi})
                    </span>
                    <span className="text-amber-500/80">•</span>
                    <span className="italic text-yellow-100/80">"{numData.tagline}"</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 3. Welcome / Initial Screen */
            <div className="flex flex-col items-center text-center p-6 max-w-md animate-float">
              <span className="text-6xl sm:text-7xl mb-3 drop-shadow-[0_0_20px_rgba(255,183,3,0.8)]">
                🪔
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 tracking-wide">
                Diwali Tambola Dhamaka
              </h2>
              <p className="text-amber-100/80 text-xs sm:text-sm mt-2 leading-relaxed">
                Welcome to the Office Tambola Night! Press the button below or hit{' '}
                <kbd className="px-2 py-0.5 rounded bg-amber-500/30 border border-amber-400/40 text-amber-300 font-mono text-xs">
                  SPACE
                </kbd>{' '}
                to hear the anchor's riddle and call out the first lucky number.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Action Controls */}
        <div className="w-full pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Main Draw Button / Skip Suspense Button */}
          {isSpeakingSuspense ? (
            <button
              onClick={onSkipSuspense}
              className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-slate-950 font-black text-base sm:text-lg tracking-wider uppercase shadow-[0_0_30px_rgba(255,183,3,0.7)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 border-2 border-yellow-200 animate-pulse"
              title="Reveal number immediately without waiting for speech to finish"
            >
              <Eye className="w-5 h-5 text-slate-950" />
              <span>Reveal Number Now</span>
              <kbd className="hidden md:inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold text-amber-950 bg-amber-300/90 rounded border border-amber-900/30">
                SPACE
              </kbd>
            </button>
          ) : !isGameOver ? (
            <button
              onClick={onPickNext}
              disabled={disabled || isRolling}
              aria-label="Pick Next Number"
              className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:via-orange-400 hover:to-red-500 text-slate-950 font-black text-base sm:text-xl tracking-wider uppercase shadow-[0_0_30px_rgba(255,130,0,0.6)] hover:shadow-[0_0_45px_rgba(255,180,0,0.9)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 group border-2 border-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5 text-yellow-950 animate-pulse" />
              <span>{isRolling ? 'Shuffling...' : currentNumber === null ? 'Start Game' : 'Pick Next Number'}</span>
              <kbd className="hidden md:inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold text-amber-950 bg-amber-300/90 rounded border border-amber-900/30 group-hover:bg-white transition">
                SPACE
              </kbd>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition duration-200" />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600/30 border border-emerald-400 text-emerald-300 font-bold text-lg">
              <CheckCircle2 className="w-6 h-6" />
              <span>All 90 Numbers Called! Happy Diwali!</span>
            </div>
          )}

          {/* Repeat Audio Button (only when not in suspense) */}
          {!isSpeakingSuspense && currentNumber !== null && !isGameOver && (
            <button
              onClick={onRepeatAudio}
              disabled={isRolling}
              title="Repeat announcement (Press R)"
              className="px-5 py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 hover:border-amber-300 font-semibold text-sm sm:text-base flex items-center gap-2 transition duration-200 active:scale-95 shadow-md"
            >
              <Volume2 className="w-5 h-5 text-amber-400" />
              <span>Repeat Voice</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-900/60 text-amber-200 border border-amber-500/30">
                R
              </kbd>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
