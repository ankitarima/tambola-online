import React from 'react';
import { History } from 'lucide-react';
import { TAMBOLA_DATA } from '../data/tambolaPhrases';

interface RecentNumbersProps {
  history: number[];
  onNumberClick?: (num: number) => void;
}

export const RecentNumbers: React.FC<RecentNumbersProps> = ({ history, onNumberClick }) => {
  // Show the last 7 called numbers, skipping the very latest (which is already huge in the center)
  const recent = history.slice(-8, -1).reverse();

  if (recent.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300/80 uppercase tracking-wider shrink-0">
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span>Recent:</span>
        </div>

        <div className="flex items-center gap-2">
          {recent.map((num, idx) => {
            const data = TAMBOLA_DATA[num];
            return (
              <button
                key={num}
                onClick={() => onNumberClick && onNumberClick(num)}
                title={`#${num} - ${data?.nickname || ''} (${data?.hindi || ''}) - Click to speak`}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-sm font-bold transition duration-200 hover:scale-105 active:scale-95 ${
                  idx === 0
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(255,183,3,0.3)]'
                    : 'bg-purple-950/40 border-amber-500/30 text-amber-100/90 hover:border-amber-400'
                }`}
              >
                <span className="text-base text-yellow-300">#{num}</span>
                {data?.hindi && (
                  <span className="text-[11px] font-normal text-amber-300/70">
                    {data.hindi}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

