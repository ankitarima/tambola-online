import React from 'react';
import { Volume2, VolumeX, Maximize, Minimize, Settings, Trophy, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenClaimVerifier: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenClaimVerifier,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="relative z-20 w-full px-4 sm:px-8 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3">
      {/* Brand Title */}
      <div className="flex items-center gap-2.5">
        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(255,183,3,0.6)] border border-yellow-200">
          <span className="text-2xl animate-diya-flicker">🪔</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 drop-shadow-sm font-sans">
              DIWALI TAMBOLA
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-red-600/70 border border-yellow-300/40 text-[10px] font-extrabold text-yellow-200 uppercase tracking-widest animate-pulse">
              LIVE ANCHOR
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-amber-200/70 font-medium">
            Office Dhamaka • Random Number Caller (1-90)
          </p>
        </div>
      </div>

      {/* Top Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Verify Claim Button */}
        <button
          onClick={onOpenClaimVerifier}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 transition active:scale-95 border border-yellow-200"
          title="Verify Winning Ticket Claim"
        >
          <Trophy className="w-4 h-4 fill-current" />
          <span>Verify Claim</span>
        </button>

        {/* Audio Mute Quick Toggle */}
        <button
          onClick={onToggleMute}
          className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
            isMuted
              ? 'bg-red-950/60 border-red-500/50 text-red-300'
              : 'bg-purple-950/60 border-amber-500/30 text-amber-300 hover:border-amber-400'
          }`}
          title={isMuted ? 'Unmute Audio (Voice & SFX)' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound ON'}</span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-amber-500/30 text-amber-300 transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode (Office Projector/TV)'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-amber-500/30 text-amber-300 transition"
          title="Anchor & Voice Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

