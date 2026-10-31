import React from 'react';
import { Play, Pause, Clock } from 'lucide-react';

interface AutoPlayControlsProps {
  isAutoPlay: boolean;
  onToggleAutoPlay: () => void;
  autoIntervalSeconds: number;
  onChangeInterval: (seconds: number) => void;
  secondsRemaining: number;
  disabled?: boolean;
}

export const AutoPlayControls: React.FC<AutoPlayControlsProps> = ({
  isAutoPlay,
  onToggleAutoPlay,
  autoIntervalSeconds,
  onChangeInterval,
  secondsRemaining,
  disabled = false,
}) => {
  const intervals = [5, 7, 10, 12, 15];

  // Calculate circular SVG progress percentage
  const progressPercent = isAutoPlay && autoIntervalSeconds > 0
    ? ((autoIntervalSeconds - secondsRemaining) / autoIntervalSeconds) * 100
    : 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-2 px-4 bg-purple-950/60 rounded-2xl border border-amber-500/20 backdrop-blur-md">
      {/* Auto Play Toggle Button */}
      <button
        onClick={onToggleAutoPlay}
        disabled={disabled}
        aria-label="Toggle Auto Play"
        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-md ${
          isAutoPlay
            ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/30 animate-pulse'
            : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isAutoPlay ? (
          <>
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause Auto-Call</span>
            {/* Circular Timer countdown indicator */}
            <span className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center text-xs font-mono text-yellow-300 ml-1">
              {Math.ceil(secondsRemaining)}
            </span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current text-amber-400" />
            <span>Start Auto-Play</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-amber-900/40 text-[10px] font-mono text-amber-300 border border-amber-500/30">
              A
            </kbd>
          </>
        )}
      </button>

      {/* Speed / Interval selection */}
      <div className="flex items-center gap-1.5 text-xs text-amber-200/80">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Interval:</span>
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-lg border border-amber-500/20">
          {intervals.map((sec) => (
            <button
              key={sec}
              onClick={() => onChangeInterval(sec)}
              className={`px-2 py-0.5 rounded-md text-xs font-bold transition ${
                autoIntervalSeconds === sec
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-amber-300/70 hover:text-white'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

